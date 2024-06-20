const fs = require('fs')

const hre = require("hardhat");
const ethers = hre.ethers
const provider = ethers.provider

const helpers = require("@nomicfoundation/hardhat-network-helpers")

const { decimals, readlineUtils, txUtils, dateUtils } = require('../utils')
const { getFunctionsForContract, getFunctionDefinitionsFromAbi } = txUtils
const { getAnswer } = readlineUtils
const { getTimeAgo, dateNowBKK, timeFmtDb } = dateUtils
const { d } = decimals

const bsovAddress = '0x26946adA5eCb57f3A1F91605050Ce45c482C9Eb1'
const bsovAbi = require('../utils/bsovAbi.json')
const bsovWhale = '0x4051963047353936096E1D4092D48e1b7386e4DE'
const bsovWhale2 = '0x047714E2E6c2386e92f7e15a48Fa900e51Cb19d6'
const bsovWhale3 = '0x13Fc4Bb93d54e6Ed4cf531D8836cA39162A51284'
const bsovWhale4 = '0x5468bd200cd52405556223ec669D3f04e64465f8'
const bsovWhale5 = '0x894129246dE1963e14B39e06c24203FDb904EAB7'
const bsovWhale6 = '0x71fdc6E7C5b76ad7b927abF8B14b9417364Ec2A2'

const timelockContract2Abi = require('../utils/timelockContract2.json')
const timelockReserveRewardsAbi = require('../utils/timelockReserveRewards.json')

let bsovContract
let bsovDecimals
let timelockAndRewardsContract
let timelockRewardsReserveContract

const run = async () => {

  const network = process.env.HARDHAT_NETWORK;
  if (typeof (network) === 'undefined') {
    console.log("Try: npx hardhat run --network <network> filepath");
    process.exit(1);
  }

  if (network !== 'hardhat' && network !== 'mainnet' && network !== 'goerli' && network !== 'sepolia') {
    console.log("Unsupported Network");
    process.exit(1);
  }

  bsovContract = new ethers.Contract(bsovAddress, bsovAbi, provider)
  bsovDecimals = parseInt(await bsovContract.decimals())

  const [owner, user1, user2, user3] = await ethers.getSigners()
  await getFunds(bsovWhale, owner)
  await getFunds(bsovWhale2, owner)
  await getFunds(bsovWhale3, owner)
  await getFunds(bsovWhale4, owner)
  await getFunds(bsovWhale5, owner)
  await getFunds(bsovWhale6, owner)

  const bsovBalance = await bsovContract.balanceOf(owner.address)
  if (Number(d(bsovBalance.toString(), bsovDecimals)) < 600000) {
    console.log('Needs more BSOV to perform tests.')
    process.exit()
  }

  await bsovContract.connect(owner).transfer(user1.address, 200000 * 10 ** 8)
  await bsovContract.connect(owner).transfer(user2.address, 100000 * 10 ** 8)

  console.log('Transferred ' + d(bsovBalance, bsovDecimals) + ' BSOV from whale wallets.')

  console.log("Deployer: " + owner.address)
  console.log("User 1:   " + user1.address)
  console.log("User 2:   " + user2.address)
  console.log("User 3:   " + user3.address)
  console.log()

  const exists = await fs.existsSync(__dirname + '/' + network)
  if (!exists) {
    console.log('Cannot find the directory to store the contract address at: ' + __dirname + '/' + network)
    process.exit()
  }

  const balance = await ethers.provider.getBalance(owner.address)
  if (Number(balance) < 100) {
    console.log('ETH Balance for ' + owner.address + ' is insufficient: ' + Number(balance))
    process.exit(1)
  }


  const parameters1 = [bsovAddress]
  const Contract1 = await hre.ethers.getContractFactory("TimelockAndRewardsContract")
  timelockAndRewardsContract = await Contract1.deploy(...parameters1)
  const timelockAndRewardsContractAddress = timelockAndRewardsContract.target
  await fs.writeFileSync(__dirname + '/' + network + '/TimelockAndRewardsContract.json', JSON.stringify({ contract: timelockAndRewardsContractAddress }, null, 4))
  console.log("TimelockContract2 deployed to: " + timelockAndRewardsContractAddress + ' on ' + network)


  // the owner sends a percent to the contract for rewards, then seeds contract
  const seedFund = 30609121600000 // as per documentation
  await bsovContract.connect(owner).transfer(timelockAndRewardsContractAddress, seedFund)
  await timelockAndRewardsContract.connect(owner).ownerSeedContract()
  console.log(await chainDate() + ' Init and Seed')
  await allTheGlobalThings()

  console.log('............. Section 1: User Deposits .............\n')
  // A couple users locks his stuff in the contract
  const sendToLockA = 101000 * 10 ** 8 // just below max in a tx
  // console.log('\nStep 1, user 1')
  const step1 = await bsovContract.connect(user1).approveAndCall(timelockAndRewardsContractAddress, sendToLockA, '0x')

  const sendToLockB = 60000 * 10 ** 8 // blast thresh by a little
  // console.log('\nStep 1, user 2')
  const step2 = await bsovContract.connect(user2).approveAndCall(timelockAndRewardsContractAddress, sendToLockB, '0x')

  const sendToLockC = 1000 * 10 ** 8
  // console.log('\nStep 1, user 1')
  const step3 = await bsovContract.connect(user1).approveAndCall(timelockAndRewardsContractAddress, sendToLockC, '0x')

  if (0) {
    console.log('User deposit totals')
    const sent = sendToLockA + sendToLockB + sendToLockC
    console.log('\ntotal sent:', sent)
    const user1Deposits = sendToLockA + sendToLockC
    console.log('user 1 deposits:' + user1Deposits)
  }

  console.log(await chainDateFmt() + ' User 1 details:')
  await allThe_userThings(user1.address)

  console.log('............. Section 2: Claim Eligible / Accept Incoming .............\n')

  // Im taking the general purpose of this is to "accept the terms"
  // but Im not sure if a withdrawal of funds is possible before this.
  const ready = await timelockAndRewardsContract.connect(user1).acceptUntakenIncomingTokens()

  console.log(await chainDateFmt() + ' User 2 details: > claim eligible amount, balance moves from eligibleAmount to untakenIncomingBalance')
  await allThe_userThings(user1.address)


  console.log('............. Section 3: Send locked tokens to single .............\n')
  // here I will send some of my locked tokens to another account. Lets consider the incidence where i 
  // want to change my wallet address to a different one, so I send the entire balance

  const balanceRegularAccount = await timelockAndRewardsContract.getBalanceRegularAccount(user1)

  console.log('User 1 totals: Here we can see the userBalance is positive')
  await allThe_userThings(user1.address)
  await timelockAndRewardsContract.connect(user1).sendLockedTokensToSingle(user3.address, balanceRegularAccount)
  console.log('User 1 totals, post: Now that the method is called userBalance is zeroed')
  await allThe_userThings(user1.address)
  console.log('User 3 totals: We cann also see that user 3 has received these tokens in untakenIncomingBalance')
  await allThe_userThings(user3.address)

  await timelockAndRewardsContract.connect(user3).acceptUntakenIncomingTokens()

  console.log('User 3 -> acceptUntakenIncomingTokens. User 1 totals are unchanged after this action')
  await allThe_userThings(user1.address)
  console.log('User 3 totals postAccept: can observe that balancIncoming is now populated')
  await allThe_userThings(user3.address)

}

const chainDateFmt = async () => {
  return timeFmtDb(await chainDate())
}

const chainDate = async () => {
  const blockTimestamp = (await provider.getBlock()).timestamp
  return blockTimestamp * 1000
}

const allTheGlobalThings = async () => {

  const date = await chainDate()

  console.log(timeFmtDb(date) + ' Globals:')

  const bsovBalance = await bsovContract.balanceOf(timelockAndRewardsContract)
  console.log('  BSOV balance (rewards)'.padEnd(30), d(bsovBalance.toString(), bsovDecimals))

  try {
    // "Regular Account"
    const getTimeLeft = await timelockAndRewardsContract.getTimeLeftRegularAccount()
    const GTLDisp = getTimeLeft > 0 ? timeFmtDb(date + parseInt(getTimeLeft) * 1000) : 0
    console.log('  getTimeLeft'.padEnd(30), GTLDisp)
    console.log('')
  } catch (error) {
    // this call throws if seed tokens are vested
    console.log('Tokens are unlocked and ready for withdrawal')
  }
}

const allThe_userThings = async (user) => {

  const date = await chainDate()
  console.log(timeFmtDb(date) + ' User Parameters:')

  const bsovBalance = await bsovContract.balanceOf(user)
  console.log('  BSOV balance'.padEnd(30), d(bsovBalance.toString(), bsovDecimals))

  // these are in the order of the contract
  const unlockedForWithdrawalRegularAccount = await timelockAndRewardsContract.getUnlockedForWithdrawalRegularAccount(user)
  console.log('  unlockedRegularAccount'.padEnd(30), d(unlockedForWithdrawalRegularAccount.toString(), bsovDecimals))

  const unlockedForWithdrawalIncomingAccount = await timelockAndRewardsContract.getUnlockedForWithdrawalIncomingAccount(user)
  console.log('  unlockedIncomingAccount'.padEnd(30), d(unlockedForWithdrawalIncomingAccount.toString(), bsovDecimals))

  const userBalance = await timelockAndRewardsContract.getBalanceRegularAccount(user)
  userBalanceDisp = d(userBalance.toString(), bsovDecimals)
  console.log('  userbalance'.padEnd(30), userBalanceDisp)

  const getUntakenIncomingBalance = await timelockAndRewardsContract.getBalanceUntakenIncomingAccount(user)
  console.log('  getUntakenIncomingBalance'.padEnd(30), d(getUntakenIncomingBalance.toString(), bsovDecimals))

  const bi = await timelockAndRewardsContract.getBalanceIncomingAccount(user)
  biDisplay = d(bi.toString(), bsovDecimals)
  console.log('  balanceIncoming'.padEnd(30), biDisplay)

  const gliaw = await timelockAndRewardsContract.getLastWithdrawalIncomingAccount(user)
  const LIAWDisp = gliaw > 0 ? timeFmtDb(parseInt(gliaw) * 1000) : 'never'
  console.log('  getLastIncAccountWithdrawal'.padEnd(30), LIAWDisp)

  const getLastWithdrawal = await timelockAndRewardsContract.getLastWithdrawalRegularAccount(user)
  const GLWDisp = getLastWithdrawal > 0 ? timeFmtDb(parseInt(getLastWithdrawal) * 1000) : 'never'
  console.log('  getLastWithdrawal'.padEnd(30), GLWDisp)

  // getTimeLeftRegularAccount is global

  const getIncomingAccountTimeLeft = await timelockAndRewardsContract.getTimeLeftIncomingAccount(user)
  const IATLDisp = timeFmtDb(date + parseInt(getIncomingAccountTimeLeft) * 1000)
  console.log('  getIncomingAccountTimeLeft'.padEnd(30), IATLDisp)


}

const getFunds = async (whale, owner) => {
  const whaleBalance = await bsovContract.balanceOf(whale)
  if (Number(d(whaleBalance.toString(), bsovDecimals)) < 10000) {
    console.log('Needs a new whale address.')
    process.exit()
  }
  try {
    await owner.sendTransaction({ to: whale, value: ethers.parseUnits('10.0', 'ether') })
  } catch (error) {
    console.log('Couldnt send eth.', error)
  }
  const bsovWhaleSigner = await ethers.getImpersonatedSigner(whale)
  const tx = await bsovContract.connect(bsovWhaleSigner).transfer(owner.address, whaleBalance)
  const receipt = await tx.wait()
}

const mine = async (days) => {
  const duration = days * 86400
  await helpers.time.increase(duration)
  await helpers.mine(1)
}


  ; (async () => {

    if (Number(process.version.split('.')[0].replace('v', '')) < 20) {
      console.log('this requires node v20. exiting')
      process.exit(3)
    }
    if (ethers.version < 6) {
      console.log('Upgrade to ethers 6. exiting.')
      process.exit(4)
    }

    try {
      await run()
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
    process.exit(0)
  })()
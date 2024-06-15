const fs = require('fs')

const hre = require("hardhat");
const ethers = hre.ethers
const provider = ethers.provider
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const { decimals, readlineUtils, txUtils, dateUtils } = require('../utils/')
const { getFunctionsForContract, getFunctionDefinitionsFromAbi } = txUtils
const { getTimeAgo, dateNowBKK, timeFmtDb } = dateUtils
const { d, bigD } = decimals

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

const ethPrice = 3540
const vestingPeriod = 1000

const run = async (userDeposit) => {

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

  const user1Balance = await bsovContract.balanceOf(user1.address)

  // console.log('Transferred ' + d(bsovBalance, bsovDecimals) + ' BSOV from whale wallets.')

  // console.log("Deployer: " + owner.address)
  // console.log("User 1:   " + user1.address)
  // console.log("User 2:   " + user2.address)
  // console.log("User 3:   " + user3.address)
  // console.log()

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
  // console.log("TimelockContract2 deployed to: " + timelockAndRewardsContractAddress + ' on ' + network)


  // the owner sends a percent to the contract for rewards, then seeds contract
  const seedFund = 30609121600000 // as per documentation
  await bsovContract.connect(owner).transfer(timelockAndRewardsContractAddress, seedFund)
  await timelockAndRewardsContract.connect(owner).ownerSeedContract()

  console.log('............. Section 1: User Deposits .............\n')

  const userGas = []

  // A couple users locks his stuff in the contract
  const sendToLockA = 101000 * 10 ** 8 // just below max in a tx
  // console.log('\nStep 1, user 1')
  const step1 = await bsovContract.connect(user1).approveAndCall(timelockAndRewardsContractAddress, userDeposit, '0x')
  let receipt = await step1.wait()
  const depositGas = displayEthReceipt(receipt, 'initial deposit - approveAndCall()')
  userGas.push(depositGas)

  console.log('............. Section 2: Claim Eligible / Accept Incoming .............\n')

  // Im taking the general purpose of this is to "accept the terms"
  // but Im not sure if a withdrawal of funds is possible before this.
  const ready = await timelockAndRewardsContract.connect(user1).acceptUntakenIncomingTokens()
  receipt = await ready.wait()
  const acceptUntakenGas = displayEthReceipt(receipt, 'engage waiting - acceptUntakenIncomingTokens()')
  userGas.push(acceptUntakenGas)

  console.log('............. Section 3: Fast Forward .............\n')
  
  await helpers.mine(vestingPeriod, { interval: 86400 }) // 1 block per day for 1000 days
  await helpers.mine(2, { interval: 86400 })
  console.log(await chainDateFmt() + ' no transactions')

  console.log('\n............. Section 4: Withdrawals .............\n')

  const withdrawal1 = 100 * 10 ** 8
  const w1 = await timelockAndRewardsContract.connect(user1).withdrawFromIncomingAccount(withdrawal1)
  receipt = await w1.wait()
  const incoming1 = displayEthReceipt(receipt, 'withdrawFromIncomingAccount()')
  userGas.push(incoming1)

  const withdrawal2 = 100 * 10 ** 8
  const w2 = await timelockAndRewardsContract.connect(user1).withdrawFromRegularAccount(withdrawal2)
  receipt = await w2.wait()
  const regular1 = displayEthReceipt(receipt, 'withdrawFromRegularAccount()')
  userGas.push(regular1)

  let withdrawalPeriod
  for (let i = 0; i < 1003; i++) { // this is arbitrary
    await helpers.mine(30, { interval: 86400 }) // 30 days later
    try {
      const w3 = await timelockAndRewardsContract.connect(user1).withdrawAll()
      receipt = await w3.wait()
      if (i == 0) {
        userGas.push(displayEthReceipt(receipt, 'withdrawAll()'))
      } else {
        userGas.push(displayEthReceipt(receipt, 'withdrawAll()', true)) // suppress further receipts
      }
    } catch (error) { 
      withdrawalPeriod = i
      i = 1003
    }
  }

  console.log('............. Section 5: Earnings and timing summary .............\n')

  const years = vestingPeriod / 365
  console.log('  Deposit Amount:'.padEnd(30) + d(userDeposit.toString(), bsovDecimals))
  console.log('  Vesting Period:'.padEnd(30) + years + ' years')
  console.log('  Withdrawal process:'.padEnd(30) + withdrawalPeriod + ' months')
  console.log('  Completion Date:'.padEnd(30) + await chainDateFmt())
  const balancePost = await bsovContract.balanceOf(user1)
  // console.log('  Start BSOV balance:'.padEnd(30) + d(user1Balance.toString(), bsovDecimals))
  // console.log('  Final BSOV balance:'.padEnd(30) + d(balancePost.toString(), bsovDecimals))
  const diff = balancePost - user1Balance
  console.log('  BSOV Earned:'.padEnd(30) + d(diff.toString(), bsovDecimals))


  let current = 0
  let sixty = 0
  let usdCurrent = 0
  let usdSixty = 0
  userGas.forEach((g) => { 
    current += Number(g.current)
    sixty += Number(g.sixty)
    usdCurrent += Number(g.usdCurrent)
    usdSixty += Number(g.usdSixty)
  })

  console.log('\n............. Section 6: Gas Consumption Totals .............\n')

  console.log('  current gas:'.padEnd(30) + current)
  console.log('  60 gwei:'.padEnd(30) + sixty)
  console.log('  USD current:'.padEnd(30) + usdCurrent)
  console.log('  USD 60 gwei:'.padEnd(30) + usdSixty)
  console.log()

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

const extraJunk = async () => {

  const rewardsFunctions = await getFunctionDefinitionsFromAbi(timelockReserveRewardsAbi, ethers)
  // console.log(rewardsFunctions)

  const currentTier = await timelockRewardsReserveContract.currentTier()
  // console.log('tier:', currentTier)

  const tiers = await timelockRewardsReserveContract.tiers(2)
  // console.log('tiers:', tiers)

  const timelockFunctions = await getFunctionDefinitionsFromAbi(timelockContract2Abi, ethers)
  // console.log(timelockFunctions)

}

const displayEthReceipt = (receipt, title, supress) => {

  const ethgas = 60000000000n

  const txGasInCurrentEth = d((receipt.gasUsed * receipt.gasPrice).toString(), 18)
  const txGasIn60gweiEth = d((receipt.gasUsed * ethgas).toString(), 18)

  const usd = txGasIn60gweiEth * ethPrice
  const current = txGasInCurrentEth * ethPrice

  if (!supress) {
    console.log('########## Ethereum Receipt: ' + title + ' ##########')
    console.log('hash:'.padEnd(25) + receipt.hash)
    console.log('from:'.padEnd(25) + receipt.from)
    console.log('to:'.padEnd(25) + receipt.to)
    console.log('EthPrice, fixed:'.padEnd(25) + ethPrice)
    console.log('Cost 60 gwei, USD:'.padEnd(25) + usd)
    console.log('Cost current, USD:'.padEnd(25) + current)
    console.log('CurrentGas, ETH:'.padEnd(25) + txGasInCurrentEth)
    console.log('Gas60gwei, ETH:'.padEnd(25) + txGasInCurrentEth)
    console.log('gasUsed:'.padEnd(25) + d(receipt.gasUsed, 18))
    console.log('gasPrice:'.padEnd(25) + d(receipt.gasPrice, 18))
    console.log()
  }
  return { current: txGasInCurrentEth, sixty: txGasIn60gweiEth, usdCurrent: current, usdSixty: usd }
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

      const userDeposits = [
        1000, 5000, 10000, 25000, 50000, 75000, 100000
      ]
      
      const snapshot = await helpers.takeSnapshot() 

      for (let i = 0; i < userDeposits.length; i++) {
        await run(userDeposits[i] * 10 ** 8)
        await snapshot.restore()
      }

    } catch (error) {
      console.log(error)
      process.exit(1)
    }
    process.exit(0)
  })()
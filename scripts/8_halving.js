// side quest: is it possible for someone to send your tokens to another account?

/* 

the contract has a halving function and this file is intended to iterate the lifecycle 
of these halvings and verify the behavior is as intended.

the variable periodWithdrawalAmount is the main controller at what determines how much 
can be determined at a specific time. It is set to 100 BSOV upon contract initialization
and then is modified during "halving" events which are triggered by newWithdrawalHalving(), 
a public function that divides that number by two.

This will result in the periodWithdrawalAmount being modified as such: 
100/2 = 50, 50/2 = 25, 25/2 = 12.5, 12.5/2 = 6.25, 6.25/2 = 3.125
But, because solidity does not support floating point logic, the actual results of this are:
50, 25, 12, 6, 3

Although this math should be considered safe, the last three halvings arent actually halvings
and they reduce the payout by more than half.  You might want to consider using an array (KISS) 
or a fixed point math library to provide a more accurate halving method.

Allowing the halving to occur, is regulated by the variable lastWithdrawalHalving which stores
the timestamp of the transaction that caused the most recent halving, or during contract init, 
which is different because in the constructor, it adds 1000 days and the current block timestamp.

the math of the halvings can be interpreted on this schedule, where "delay" represents the time 
when it is possible to call the function to the time it is actually called, illustrated here in increments of ten

Alha time is the time the contract is broadcasted
initial: Alpha Time plus 1000 days (withdrawals are not allowed during this period anyway) +1000
first: initial + delay + 1500 days  = 2510 days out
second: 4020 days out (11 years)
third: 5530 days out ( 15 years )
fourth: 7040 days out ( 19 years )
fifth: 8550 days out ( 23 years )

During the withdrawal process, elapsedWithdrawalPeriods may grow to ten, but if it goes above ten, 
the number is set to ten  

One consideration is if someone is accumulating withdrawals and a halving occurs, all accumulated 
withdrawals before the halving are lowered to the post halving amount.

there is a getter function for the next withdrawal halving
returning zero for withdrawalHalvingEra >= maxWithdrawalHalvingEras
should probably be replaced with a require statement and error msg

*/


const fs = require('fs')

const hre = require("hardhat");
const ethers = hre.ethers
const provider = ethers.provider

const helpers = require("@nomicfoundation/hardhat-network-helpers")

const { decimals, readlineUtils, txUtils, dateUtils } = require('../utils/')
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

const ethPrice = 3540

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

  console.log('............. Section 3: Fast Forward  .............\n')

  console.log(await chainDateFmt() + ' Fast forward -> Day Before')
  await mine(1100)

  await allTheGlobalThings()
  await allThe_userThings(user1.address)

  console.log(await chainDateFmt() + ' Day After: User able to withdrawal 100 tokens from either account')
  await mine(2)

  await allTheGlobalThings()
  await allThe_userThings(user1.address)

  console.log('............. Section 4: Withdrawals .............\n')

  // can only withdrawal 100 tokens per day after 1000 days has elapsed
  const withdrawal1 = 100 * 10 ** 8
  await timelockAndRewardsContract.connect(user1).withdrawFromIncomingAccount(withdrawal1)

  console.log(await chainDateFmt() + ' After Withdrawal 1: Balances')
  await allTheGlobalThings()
  await allThe_userThings(user1.address)


  // can only withdrawal 100 tokens per day after 1000 days has elapsed
  const withdrawal2 = 100 * 10 ** 8
  await timelockAndRewardsContract.connect(user1).withdrawFromRegularAccount(withdrawal2)

  console.log(await chainDateFmt() + ' After Withdrawal 2: Balances')
  await allTheGlobalThings()
  await allThe_userThings(user1.address)

  console.log('............. Section 5: Weekly Withdrawals continued (takes a bit to simulate).............\n')

  // can only withdrawal 100 tokens per week after 1000 days has elapsed
  let elapsedHours = 0
  let withdrawalPeriod
  const limit = 3500
  for (let i = 0; i < limit; i++) { // this is arbitrary
    await mine(7)
    try {
      
      const w3 = await timelockAndRewardsContract.connect(user1).withdrawAll()
      receipt = await w3.wait()
      elapsedHours += 170
      if (i == 0) {
        displayEthReceipt(receipt, 'withdrawAll()')
      } else {
        displayEthReceipt(receipt, 'withdrawAll()', true)
      }

      const ts = await timelockAndRewardsContract.getTimestampOfNextWithdrawalHalving()
      const halvingBlock = (await provider.getBlock()).timestamp
      if (Number(ts) === halvingBlock) {
        await timelockAndRewardsContract.newWithdrawalHalving()
        const multiplier = await timelockAndRewardsContract.periodWithdrawalAmount()
        const era = await timelockAndRewardsContract.withdrawalHalvingEra()
        console.log('Halved at ' + halvingBlock + ' multiplier: ' + multiplier + ' ' + era)
      }
      // process.exit()
    } catch (error) {
      withdrawalPeriod = i
      i = limit
    }
  }

  const days = elapsedHours / 24
  console.log('Time Elapsed withdrawaling from fund: ' + days + ' days.\n')

  await allThe_userThings(user1.address)

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
    console.log('Gas60gwei, ETH:'.padEnd(25) + txGasIn60gweiEth)
    console.log('gasUsed:'.padEnd(25) + d(receipt.gasUsed, 18))
    console.log('gasPrice:'.padEnd(25) + d(receipt.gasPrice, 18))
    console.log()
  }
  return { current: txGasInCurrentEth, sixty: txGasIn60gweiEth, usdCurrent: current, usdSixty: usd }
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
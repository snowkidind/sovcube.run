# BSOV sovcube contract verification and "pseudo-audit"

DISCLAIMER: This isn't really an "official" audit because the author is not affiliated with any auditing platform, nor is this a formal process. 

# Contract details:

 ## The flow of tokens

  the contract doesnt deal with ether at all so there are no payable functions.

  erc20 token BSOV is moved externally primarily by four functions

- receiveApproval, which calls calculateAndSendRewardsAfterTimelock
  
  SST's (Stupid security tests)
  1. What if a different currency is deposited? - ok

- withdrawFromRegularAccount
- withdrawFromIncomingAccount
- withdrawAll

there are functions which contain internal transfer logic as well. this allows for one account to transfer to another account. It should be noted that these are internal transfers and the contract balance is not affected therefore these transfers are not subject to the 1% burn on transfer fee.

- sendLockedTokensToSingle
- sendLockedTokensToMany

A user must "take custody" of the above sent tokens before they may withdrawal them
 - function acceptUntakenIncomingTokens

the remaining functions are views and provide access primarily to hash tables

# halving notes
It appears that anyone may call the halving function, which has a guard in it that only allows a successful transaction if the duration has exceed the appropriate duration. 


# general observations

  From the initial broadcast of the contract, a 1000 day hold is mandatory for all normal deposits, and rewards payments will not be offered during this period. 
  
  After the initial 1000 days of the contract life, an existing deposit account is able to make subsequent deposits with a 7 day wait before being able to withdrawal a distribution of the original principal. 
  
  During the initial 1000 days of the contract life, the user is also able to make additional deposits.
  
  After the initial 1000 days, any new accounts must wait ten weeks before qualifying for distributions.

  There are two accounts, a normal deposit account and a rewards account. Deposits that qualify for rewards require an extra step in order to claim the rewards. In order to collect rewards, the user must call acceptUntakenIncomingTokens.
  
  Calling acceptUntakenIncomingTokens initiates a secondary 1000 day timer, in order to accept rewards the deposit qualified for. Subsequent calls to this endpoint cause the rewards received timer to update to 1000 days from the subsequent transaction. In this design, **there is no independent tracking for multiple deposits to a single account**. 

  The ability to **transfer locked assets including untaken rewards** would also allow secondary markets to operate over those tokens. Ideally, this feature would be integrated by utilizing an NFT, which would also allow a single user to have multiple deposits with different unlock times.

  There is no way to **pause the contract** from accepting further deposits and payouts. This is fine as long as everything works, but it might be useful to have such a function if a draining exploit was found. This tweak has various implications.

  RESOLVED It would be nice to **combine transactions** withdrawFromIncomingAccount and withdrawFromRegularAccount in a single transaction or better just withdrawal what is available to withdrawal right now. Although it is important to show how much comes from either action, which can be observed with events.

  RESOLVED It would be nice to get a block height at which the next withdrawal is possible - It was determined that this was not appropriate for the contract because it uses timestamps for this which are non deterministic

  It would be nice to have a **large deposit threshold** which allows for larger withdrawals to account for the time difference it takes to close out a larer position as opposed to a smaller position.

# 1_deploy.js

  This is just a basic run of the main functions in order to set a template for the rest of the testing process. Additiional files will be for different tests

# 2_seedDepleted.js Notes

  In this test I observed the way the contract behaves when all the rewards are allocated to users.
  
  What happens is that there is a balance kept which is available to users to collect and the rewards are assigned to
  users
  
  There is a guard in place that retruns from the assignment function (calculateAndSendRewardsAfterTimelock) wherein 
  if deposits were greater than the available rewards, the function would return instead of failing the transaction.

  Initially, this was an issue for me because I was unaware of future utility of the project outside of the fund. But after a discussion, I now understand that the deposits stay in the normal user balance and also serve a future purpose which is part of a pending governance contract, which will base its priorities dependent on whom is involved with this contract.

  This will require a post-rewards set of tests to ensure continuous operation after the rewards period.

  > Without this guard, eventually the rewards contract, maintiaining its internal balance via balanceRegularAccount[address(this)] would underflow causing the transaction to fail. In the current use case this is not an issue but, by convention, the use of hard coded amounts (300k) should be made into a constructor variable.

  In the case a deposit exceeds the available tokens for rewards, the contract should accept the deposit and pay whatever remaining rewards are available, allocating the remaining rewards to that deposit, ensuring balances are 
  distributed appropriately.

  In the event that there are not enough depositors to cover the entire rewards program, the tokens remaining are **currently unable to be re-allocated**. Perhaps there should be a closeRewards function which allows you to collect the unclaimed rewards early so you can allocate them for other projects etc

# 3_tierLogic.js

I reimplemented the tier system in pureJs to get a better understanding of what it does. 

The purpose of this function is to reward early adopters to get a higher reward than later adopters. This is achieved by increasing the global tier as the deposits roll in. If the deposit triggers the global tier switch, the early part of the deposit is credited with the  higher rate and the later goes towards the lower rate. 

Further the tier system asserts its independence from the rest of the contract by increasing account balances based on the rewards initially on the deposit transaction. This method asserts no further calculation is necessary once the deposit is processed. In other words your rewards are determined on the transaction of your deposit and are fixed. For subsequent deposits, they would be calculated on the spot as well.

The contract is intended to be seeded once and only once. There are no restaking options once rewards mature. 

The hardcoded max of 300k locks forever any seed deposit amounts over that specific balance, which is hard to calculate to exact because of the 1 % burn. 

As it stands the balance after the suggested seed deposit is 300000.0008016 which by default ensures that dust will remain under no ownership in the contract at the end of its life. 

During the ownerSeedContract() transaction, there is no code to stop a deposit of a different amount from  occurring. Consider an extra or a missing zero, fat finger type of error. It might be useful to either force the seed deposit to be an exact value, or better, allow multiple seeds. There would be some maths necessary in order to allow future seeding but it doesn't seem impossible.

# 4_sendinternalsingle.js

  IN_TESTING: There is internal transfer logic which comes across as somewhat janky. An account is initied with rewards built in to it via a second internal account. When a user makes an internal transfer, the rewards tokens stay in the initial account and do not transfer along with the normal user account tokens. Both accounts stay locked for the duration but the receiving account must call acceptUntakenIncomingTokens() and restart a thousand day lockdown.

  I have a couple issues with that: 
  - the entire balances should be transferred
  - the timelock should carry over to the recipient address

  This should not be difficult to integrate and would resolve a few use cases and subsequent issues that I can imagine:

   - In the case that BSOV becomes of extremely high value, people might want to move their ownership to a gnosis safe.
   - User wants to move off of low security metamask wallet onto a HW wallet for long haul
   - The contract requires control of the address which made the initial deposit, which can be lost or stolen.
   - should a user die, this could cause legal reason to lock up their entire estate for a abnormal period of time.
   - generally, a 3.5 year lockdown should have custodial transfer abilities

# 5_afterlife.js

The rewards contract is a setup for the future governance contract which will evaluate holders in the fund for positioning in the governance system. In order to participate in the governance system, the user must timelock their tokens. There is a ranking system and in order to get voting power and voting rewards, a user must be a "top timelocker"

At any point in time the balance of top timelockers is based on the owner owning 1% of the locked tokens, so the intended behavior is that a user can lose their status should they be outbid by a larger player.

Since all token withdrawals are throttled at 100 BSOV per week, A user cannot manipluate the voting body by the "allocate, vote and dump" method without paying the penalty of a throttled withdrawal process. 

Over the course of its life the governance contract may have different requirements to be a top timelocker, perhaps the percentage in ownership required could be lowered, for example, in order to prevent large players from reducing the theoretical voting body to manipulable levels.

As it stands, the fund contract will contain these locked user deposits far after the life of the rewards program, which is intended to be run once and only once. Therefore, testing the post fund world is what this file is about in particular.

In this test I will go over the lifecycle of the fund and test operation in the post-fund world.

A couple takeaways from this file:

There is a **two percent fee** - one percent in and a one percent out fee from the underlying contract. While the earned rewards are accumulating, this is negligible and unnoticeable but when its 1:1 deposits to withdrawals, the cost of 2 percent is more noticeable. This should be documented as people will forget that BSOV is deflationary or just need to be reminded of this in general.

Upon depositing after the rewards funds have been consumed, it is currently possible to **withdrawal 100 BSOV immediately** if you participated in the fund and withdrew all previously.


# 6_gasUsage.js

## Consumer Gas Usage

Gas metrics were recorded for various deposits of size. Here are the current results for gas usage and duration requirements. This includes all consumer side transactions, based on a monthly withdrawal schedule. Gas costs can be further reduced by withdrawing on intervals of up to ten weeks.

| **Deposit Amount (BSOV)** | **Vesting (Years)** | **Duration** | **Completion Date** | **BSOV Earned** | **Current Gas (ETH)** | **Gas at 60 Gwei (ETH)** | **USD Current**    | **USD at 60 Gwei** |
| ------------------ | ------------------ | ---------------------- | ------------------- | --------------- | --------------------- | ------------------------ | ------------------ | ------------------ |
| 1000               | 2.73   | 3 months               | 2027-03-18 | 960.2           | 0.00159  | 0.04181052     | 5.63  | 148.00        |
| 5000               | 2.73  | 13 months              | 2028-01-02 | 4801            | 0.00256  | 0.09887712     | 9.09  | 350.02 |
| 10000              | 2.73  | 25 months              | 2028-12-15 | 9602            | 0.00371 | 0.16735704      | 13.13 | 592.44  |
| 25000              | 2.73   | 62 months              | 2031-11-23 | 24005           | 0.00722    | 0.37850417      | 25.59 | 1339.90  |
| 50000              | 2.73   | 124 months             | 2036-10-25 | 48010           | 0.01312  | 0.7323170      | 46.46 | 2592.40  |
| 75000              | 2.73   | 186 months             | 2041-09-27 | 72015           | 0.01902   | 1.0861300       | 67.34  | 3844.90 |
| 100000             | 2.73  | 248 months             | 2046-08-30 | 96020           | 0.024920   | 1.4399429       | 88.21  | 5097.39  |

# 7_gasUsage_deployer.js

Hardhat has an ambiguous way of determining contract gas so I calculated it by counting the gasUsed within the block itself. Normal hardhat blocks without transactions dont have any gas usage. The main transaction of interest is the contract deployment and using this method I determined this information:

## Deployment transaction

| **Parameter**     | **Value**            |
| ----------------- | -------------------- |
| EthPrice, fixed   | 3540                 |
| Cost 60 Gwei, USD | 462.3213096          |
| Cost Current, USD | 25.45396259193095    |
| CurrentGas, ETH   | 0.007190384912974844 |
| Gas60Gwei, ETH    | 0.13059924           |
| GasUsed           | 0.000000000002176654 |
| GasPrice          | 0.000000003303411986 |


## Totals (all transactions): 

| **Parameter** | **Value** |
| ------------- | --------- |
| Current Gas   | 0.00788   |
| 60 Gwei       | 0.14179   |
| USD Current   | 27.90     |
| USD 60 Gwei   | 501.95    |


# Compiler warnings

Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
   --> contracts/TimelockAndRewards.sol:170:9:
    |
170 |         bytes memory _extraData
    |         ^^^^^^^^^^^^^^^^^^^^^^^


contracts/BSOVtoken-test-contract.sol:287:43: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function getMintDigest(uint256 nonce, bytes32 challenge_digest, bytes32 challenge_number) public view returns(bytes32 digesttest) {
                                          ^----------------------^

contracts/_BitcoinSoV.sol:285:43: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function getMintDigest(uint256 nonce, bytes32 challenge_digest, bytes32 challenge_number) public view returns(bytes32 digesttest) {
                                          ^----------------------^

contracts/OriginalTimelockContract.sol:106:87: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function receiveApproval(address _sender, uint256 _value, address _tokenContract, bytes memory _extraData) public {
                                                                                      ^---------------------^
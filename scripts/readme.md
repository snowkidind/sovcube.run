# general observations

  Any subsequent deposits to the same address reset the countdown to 1000 days. A user should expect to make **multiple deposits** and store unlock times for each discrete deposit. (the obvious workaround is to use multiple accounts)

  The ability to **transfer locked assets including rewards** would also allow secondary markets to operate over those tokens. Ideally, this feature would be integrated by utilizing an NFT, which would also allow a single user to have multiple deposits with different unlock times.

  There is no way to **pause the contract** from accepting further deposits and payouts. This is fine as long as everything works, but it might be useful to have such a function if a draining exploit was found. This tweak has various implications.

  It would be nice to **combine transactions** withdrawFromIncomingAccount and withdrawFromRegularAccount in a single transaction or better just withdrawal what is available to withdrawal right now. Although it is important to show how much comes from either action, which can be observed with events.

  It would be nice to get a block height at which the next withdrawal is possible

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

Over the course of its life the gonernance contract may have different requirements to bea top timelocker, perhaps the percentage in ownership required could be lowered, for example, in order to prevent large players from reducing the theoretical voting body to manipulable levels.

As it stands, the fund contract will contain these locked user deposits far after the life of the rewards program, which is intended to be run once and only once. Therefore, testing the post fund world is what this file is about in particular.

In this test I will go over the lifecycle of the fund and test operation in the post-fund world.

A couple takeaways from this file:

There is a **two percent fee** - one percent in and a one percent out fee from the underlying contract. While the earned rewards are accumulating, this is negligible and unnoticeable but when its 1:1 deposits to withdrawals, the cost of 2 percent is more noticeable. This should be documented as people will forget that BSOV is deflationary or just need to be reminded of this in general.

Upon depositing after the rewards funds have been consumed, it is currently possible to **withdrawal 100 BSOV immediately** if you participated in the fund and withdrew all previously.


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
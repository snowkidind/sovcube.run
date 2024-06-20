/* 

This is intentional and considered resolved:

On adding the new code I noticed that during the withdrawal stage
lockExpirationForUserIncomingAccount[msg.sender] was moved forward

the difference is caused in the if statement in acceptUntakenIncomingTokens 
during the initial period, the first block is ran and calculated as: 
globalLockExpirationDateRegularAccount + resetTimeLeftIncomingAccount

[the blocktimestamp of the contract genesis plus 1000 days] + [100 days]
so the first withdrawals are available after 1100 days now, instead of a thousand days.
if the withdrawal date is after the 1000 days, then the value is populated with now + 100 days

*/
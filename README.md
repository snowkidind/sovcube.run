# SovCube.com Website, Timelocking dApp & Smart-contracts

Timelock BSOV Tokens and receive giveaway rewards.

### Known issues:

- CRITICAL - [WORKING ON IT] The window variables interfere with Uniswap.
- INFO - Stats are not made.
- INFO - Docs & Help page needs to be filled.
- INFO - Create "My Account" page.
- CODE COSMETIC - Code Cleanup of app.js needed.
- CODE COSMETIC - Code Cleanup of contract2-calls.js needed.
- CODE COSMETIC - Code Cleanup of contract1-calls.js needed.
- CODE COSMETIC - Code Cleanup of styles.css needed.
- CODE COSMETIC - Code Cleanup of GiveawayReserve Contract needed.
- CODE COSMETIC - Code Cleanup of TimelockContract needed.
- UI COSMETIC - Implement responsive design fitting for phones and tablets.
- UI INFO - Add dynamic info from giveawayReserve contract and unlock info when entering amount in the timelocking amount field. 
- FUNCTIONALITY IDEAS - Determine if users also can add tokens the reserve contract balance, instead of the current "ownerOnly". If so, then change logic on tier advancement, so that the tiers reflect how many tokens have been donated to the Giveaway Reserve contract.
- FUNCTIONALITY IDEAS - Determine what happens when we reach the final tier, and when the tokens in the Giveaway Reserve contract are used up.
- TESTING - Test timelocking from several different wallets to see if gas usage changes.


### Order of actions when deploying the contracts for testing:
- Use "Remix - Ethereum IDE"
- Deploy BSOV Token contract (if testing on testnet).
- In TimelockContract.sol: Set BSOV Token Contract Address.
- Deploy TimelockContract.sol.
- Deploy GiveawayReserveContract.sol (to deploy: enter address of BSOV Token and Timelock Contract in their respective fields).
- Call the "setGiveawayReserveAddress" method in the TimelockContract.sol - Enter the GiveawayReserve address.
- Transfer enough BSOV Tokens to the GiveawayReserve address. (In this case, enter 30650000000000, exacting 306,500 BSOV Tokens in the "tokens" field.)
- Call the "ownerTimelockTokens" method in the GiveawayReserve contract, enter 30343500000000, exacting 303,435 BSOV in the "tokens" field, and put "0x" in the data field.

- Now the contracts are ready for usage and testing.

### To test the dApp web interface
- First deploy the contracts as instructed above
- Clone this Git repository to your hard drive
- Install apache2 and php and setup apache to direct to localhost, and the folder of sovcube.com/site
- Edit /dapp/app.js and edit the addresses of:

contract1Address = '0xb045F5aa2A057ab5CA8bcbd70D23f06E3409Ba77'; // Doesn't need replacing
contract2Address = '0xD93355C3e7E1cB4B8e6bafe39c45a4B204DD2843'; // Insert address of TimelockContract
tokenContractAddress = '0x09136144d9E442314051735DCa3Ead1a705f1546'; // Insert address of BSOV token contract
giveawayReserveContractAddress = '0x8a6c076C67685230fb5e63EBF00943DCD32d09BC'; // Insert address of Giveaway Reserve contract.


- Done! Now you are able to test the website, the dApp, and the contracts.



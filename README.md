# SovCube.com Website, Timelocking dApp & Smart-contracts

Timelock BSOV Tokens and receive giveaway rewards.

### Known issues:

- CRITICAL - [WORKING ON IT] The window variables interfere with Uniswap.
- INFO - Stats are not made.
- INFO - Docs & Help page needs to be filled.
- COSMETIC - Code Cleanup needed.
- COSMETIC - Implement responsive design fitting for phones and tablets.
- UI - Add error message when timelocking 100 Mundos or less.


### Order of actions when deploying the contracts for testing:
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
`
const contract1Address = '0xb045F5aa2A057ab5CA8bcbd70D23f06E3409Ba77'; // Doesn't need replacing
const contract2Address = '0xD93355C3e7E1cB4B8e6bafe39c45a4B204DD2843'; // Insert address of TimelockContract
const tokenContractAddress = '0x09136144d9E442314051735DCa3Ead1a705f1546'; // Insert address of BSOV token contract
const giveawayReserveContractAddress = '0x8a6c076C67685230fb5e63EBF00943DCD32d09BC'; // Insert address of Giveaway Reserve contract.
`

- Done! Now you are able to test the website, the dApp, and the contracts.



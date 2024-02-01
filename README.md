# SovCube.com Website, Timelocking dApp & Smart-contracts

Timelock BSOV Tokens and receive Timelock Rewards.

### Known issues and to-do:

- Add more info to My Account page.
- - Specifically:
- - - List personal timelocking transactions.

- Add more info to Stats page
- - Specifically:
- - - Add web3 calls to Docs & Help page
- - - List last timelocking transactions
- CODE COSMETIC - Code Cleanup of app.js
- CODE COSMETIC - Code Cleanup of contract2-calls.js
- CODE COSMETIC - Code Cleanup of contract1-calls.js
- CODE COSMETIC - Code Cleanup of styles.css
- CODE COSMETIC - Code Cleanup of account.js.
- CODE COSMETIC - Code Cleanup of functions.php
- CODE COSMETIC - Code Cleanup of /stats/index.php
- CODE COSMETIC - Code Cleanup of /dapp/index.php

- UI COSMETIC - Implement responsive design fitting for phones and tablets.
- CONTRACT TESTING - Test timelocking from several different wallets to see if gas usage changes.


### Order of actions when deploying the contracts for testing:
- Use "Remix - Ethereum IDE"
- Deploy BSOV Token contract (if testing on testnet).
- In TimelockContract.sol: Set BSOV Token Contract Address.
- Deploy TimelockContract.sol.
- Deploy TimelockRewardsReserve.sol (to deploy: enter address of BSOV Token and Timelock Contract in their respective fields).
- Call the "setTimelockRewardReserveAddress" method in the TimelockContract.sol - Enter the Timelock Rewards Reserve Contract address.
- Transfer enough BSOV Tokens to the Timelock Rewards Reserve Contract address address. (In this case, enter 30609121600000, exacting 306,091 BSOV Tokens in the "tokens" field.)
- Call the "ownerTimelockTokens" method in the Timelock Rewards Reserve contract, enter 30303030384000, exacting 303,030 BSOV in the "tokens" field, and put "0x" in the data field.

- Now the contracts are ready for usage and testing.

### To test the dApp web interface
- First deploy the contracts as instructed above
- Clone this Git repository to your hard drive
- Install apache2 and php and setup apache to direct to localhost, and the folder of sovcube.com/site
- Edit /dapp/app.js and edit the addresses of:

- `contract1Address = '0x...'; // Insert address of Original Timelock Contract`
- `contract2Address = '0x...'; // Insert address of TimelockContract`
- `tokenContractAddress = '0x...'; // Insert address of BSOV token contract`
- `timelockReserveContractAddress = '0x...'; // Insert address of Timelock Rewards Reserve contract.`

(Optional: To test the stats page: First setup the sovcube-apps repository (https://github.com/realrouse/sovcube-apps) and follow the instructions there)
- Copy /site/config.php-sample and rename it to config.php, and fill in MySQL data.
- Edit /site/functions.php and add the Timelock Reward Reserve Contract here: `$timelockRewardReserveContractAddress = "0xFC88e4103A5e3647cF3661e2ef41C985b73585DB";
`
- Done! Now you are able to test the website, the dApp, and the contracts.

### Backend (sovcube-apps repository)
- First clone the Github repository of "sovcube-apps" at https://github.com/realrouse/sovcube-apps
- Follow the instructions of that repository


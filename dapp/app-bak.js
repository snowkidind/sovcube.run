// app.js


document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');

    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
});



const contract1Address = '0x19E6BF254aBf5ABC925ad72d32bac44C6c03d3a4'; // Replace with actual Contract 1 address
const contract2Address = '0x73C5c8F335abdA336d55b69169F5FFdb9d61550b'; // Replace with actual Contract 2 address
const tokenContractAddress = '0x26946adA5eCb57f3A1F91605050Ce45c482C9Eb1';
/*const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH*/

let web3;
let selectedAccount;


// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
}


function toggleConnectButtonText() {
    const connectButton = document.getElementById('connectWallet');
    if (selectedAccount) {
        connectButton.innerText = 'Disconnect Wallet';
    } else {
        connectButton.innerText = 'Connect to Wallet';
    }
}

// Function to handle wallet connection
async function connectWallet() {
    if (selectedAccount) {
        // Disconnect the wallet
        selectedAccount = null;
        localStorage.removeItem('selectedAccount'); // Remove account from local storage
        updateUIForDisconnectedWallet();
    } else if (window.ethereum) {
        // Connect to the wallet
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            localStorage.setItem('selectedAccount', selectedAccount); // Store account in local storage
            updateUIForConnectedWallet(selectedAccount);
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

/*
async function connectWallet() {
    if (selectedAccount) {
        // Disconnect the wallet
        selectedAccount = null;
        const walletStatus = document.getElementById('walletStatus');
        walletStatus.innerText = 'Wallet disconnected';
        walletStatus.style.color = 'red';
        toggleConnectButtonText();
        // Additional UI reset actions go here (e.g., hiding specific elements)
    } else if (window.ethereum) {
        // Connect to the wallet
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            const walletStatus = document.getElementById('walletStatus');
            walletStatus.innerText = `Connected to ${selectedAccount}`;
            walletStatus.style.color = 'green';
            toggleConnectButtonText();
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}
*/

/*
async function connectWallet() {
    if (selectedAccount) {
        // User is already connected, so we'll disconnect
        selectedAccount = null;
        const walletStatus = document.getElementById('walletStatus');
        walletStatus.innerText = 'Disconnected';
        walletStatus.style.color = 'red';
        toggleConnectButtonText();
    } else if (window.ethereum) {
        // Connect to the wallet
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            const walletStatus = document.getElementById('walletStatus');
            walletStatus.innerText = `Connected to ${selectedAccount}`;
            walletStatus.style.color = 'green';
            toggleConnectButtonText();
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}
*/

/*
// Function to handle wallet connection
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            const walletStatus = document.getElementById('walletStatus');
            walletStatus.innerText = `Connected to ${selectedAccount}`;
            walletStatus.style.color = 'green';

            // Call function to update UI based on connection
            updateUIOnConnection(selectedAccount);
	   toggleConnectButtonText();
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}
*/

/*
// Function to update UI after disconnecting the wallet
function updateUIForDisconnectedWallet() {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
}
*/

/*
function updateUIForDisconnectedWallet() {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements


   const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    document.querySelector('.contract-selection').style.display = 'none';
   connectYourWalletText.style.display = 'block';
          document.getElementById('contract1Details').style.display = 'none';
        document.getElementById('contract2Details').style.display = 'none';
        contract1InfoHeader.style.display = 'none';
        contract2InfoHeader.style.display = 'none';
        contract1DynamicInfo.style.display = 'none';
        contract2DynamicInfo.style.display = 'none';
        contractInfoContainer.style.display = 'none';

     resetContractUI();
    // Other UI reset actions can be added here as needed
}
*/

/*
function updateUIForDisconnectedWallet() {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements
    document.querySelector('.contract-selection').style.display = 'none';
    document.getElementById('contractSelect').style.display = 'none';
    document.querySelectorAll('.contractDetails').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.infoHeader').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.dynamicInfo').forEach(el => el.style.display = 'none');
    document.getElementById('contractInfoContainer').style.display = 'none';
   
    resetContractUI();
}
*/

/*
function updateUIForDisconnectedWallet() {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const connectYourWalletText = document.querySelector('.connectYourWalletText');

if (contractSelect) contractSelect.style.display = 'none';
if (contract1InfoHeader) contract1InfoHeader.style.display = 'none';
// and so on for each element

if (contract2InfoHeader) contract2InfoHeader.style.display = 'none';
if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'none';
if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'none';
if (contractInfoContainer) contractInfoContainer.style.display = 'none';
if (connectYourWalletText) connectYourWalletText.style.display = 'block';
// Add similar checks for any other elements you need to modify


    document.querySelector('.contract-selection').style.display = 'none';
    connectYourWalletText.style.display = 'block';
    contractSelect.style.display = 'none';
    contract1InfoHeader.style.display = 'none';
    contract2InfoHeader.style.display = 'none';
    contract1DynamicInfo.style.display = 'none';
    contract2DynamicInfo.style.display = 'none';
    contractInfoContainer.style.display = 'none';

    resetContractUI();
}
*/

function updateUIForDisconnectedWallet() {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const connectYourWalletText = document.querySelector('.connectYourWalletText');
    const withdraw1 = document.getElementById('withdraw1');

     if (withdraw1) withdraw1.style.display = 'none';
    if (contractSelect) contractSelect.style.display = 'none';
    if (contract1InfoHeader) contract1InfoHeader.style.display = 'none';
    if (contract2InfoHeader) contract2InfoHeader.style.display = 'none';
    if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'none';
    if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'none';
    if (contractInfoContainer) contractInfoContainer.style.display = 'none';
    if (connectYourWalletText) connectYourWalletText.style.display = 'block';

    resetContractUI(); // Make sure this function also hides relevant elements correctly
}


/*
// Function to update UI after connecting the wallet
function updateUIForConnectedWallet(account) {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = `Connected to ${account}`;
    walletStatus.style.color = 'green';
    toggleConnectButtonText();

    // Show or reset dApp-specific UI elements
    const contractSelect = document.getElementById('contractSelect');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const connectYourWalletText = document.querySelector('.connectYourWalletText');

    if (contractSelect) contractSelect.style.display = 'block';
    if (contractInfoContainer) contractInfoContainer.style.display = 'block';
    if (connectYourWalletText) connectYourWalletText.style.display = 'none';

    // Reset the display of contract details based on the selected value
    updateContractDetailsDisplay(contractSelect.value);
}

function updateContractDetailsDisplay(selectedContract) {
    const contract1Details = document.getElementById('contract1Details');
    const contract2Details = document.getElementById('contract2Details');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');

    // Hide all first
    [contract1Details, contract2Details, contract1InfoHeader, contract2InfoHeader, contract1DynamicInfo, contract2DynamicInfo].forEach(el => {
        if (el) el.style.display = 'none';
    });

    // Show based on selected contract
    if (selectedContract === 'contract1') {
        if (contract1Details) contract1Details.style.display = 'block';
        if (contract1InfoHeader) contract1InfoHeader.style.display = 'block';
        if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'block';
    } else if (selectedContract === 'contract2') {
        if (contract2Details) contract2Details.style.display = 'block';
        if (contract2InfoHeader) contract2InfoHeader.style.display = 'block';
        if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'block';
    }
}

*/


// Function to update UI after connecting the wallet
function updateUIForConnectedWallet(account) {
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = `Connected to ${account}`;
    walletStatus.style.color = 'green';
    toggleConnectButtonText();
    updateUIOnConnection(selectedAccount);
}




/*
// Function to check wallet connection on load
function checkWalletConnection() {
    const storedAccount = localStorage.getItem('selectedAccount');
    if (storedAccount) {
        selectedAccount = storedAccount;
        updateUIForConnectedWallet(selectedAccount);
    } else {
        console.log('No connected account found');
    }
}

// Check wallet connection on page load
window.addEventListener('load', checkWalletConnection);
*/
/*
// Function to check wallet connection on load
async function checkWalletConnection() {
    if (window.ethereum) {
        try {
            // Request currently connected accounts
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
                // An account is connected
                selectedAccount = accounts[0];
                updateUIForConnectedWallet(selectedAccount);
            } else {
                // No accounts connected
                console.log('No connected account found');
                updateUIForDisconnectedWallet();
            }
        } catch (error) {
            console.error('Error checking for connected accounts:', error);
        }
    }
}

*/

async function checkWalletConnection() {
    if (window.ethereum) {
        try {
            // Request currently connected accounts
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            // Check local storage for the account state
            const storedAccount = localStorage.getItem('selectedAccount');

            if (accounts.length > 0 && storedAccount === accounts[0]) {
                // An account is connected and matches the stored account
                selectedAccount = accounts[0];
                updateUIForConnectedWallet(selectedAccount);
            } else {
                // No accounts connected or the stored account does not match
                console.log('No connected account found or mismatch with stored account');
                updateUIForDisconnectedWallet();
            }
        } catch (error) {
            console.error('Error checking for connected accounts:', error);
        }
    }
}


// Call this function when the page loads
window.addEventListener('load', checkWalletConnection);



/*
// Function to check wallet connection on load
function checkWalletConnection() {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            if (accounts.length > 0) {
                // An account is connected
                selectedAccount = accounts[0];
                const walletStatus = document.getElementById('walletStatus');
                walletStatus.innerText = `Connected to ${selectedAccount}`;
                walletStatus.style.color = 'green';
                updateUIOnConnection(selectedAccount);
		toggleConnectButtonText();

            } else {
                // No accounts connected
                console.log('No connected account found');
            }
        })
        .catch(error => {
            console.error('Error checking for connected accounts:', error);
        });
    }
}
*/




// Function to update the UI after wallet connection
function updateUIOnConnection(account) {
    console.log(`Connected to account: ${account}`);
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
if (contractSelect)  {
document.querySelector('.contract-selection').style.display = 'block';
   connectYourWalletText.style.display = 'none';

    contractSelect.addEventListener('change', function(event) {
        const selectedContract = event.target.value;

        // Hide all contract details, headers, and dynamic info first
	    
        document.getElementById('contract1Details').style.display = 'none';
        document.getElementById('contract2Details').style.display = 'none';
        contract1InfoHeader.style.display = 'none';
        contract2InfoHeader.style.display = 'none';
        contract1DynamicInfo.style.display = 'none';
        contract2DynamicInfo.style.display = 'none';
        contractInfoContainer.style.display = 'none';
	

        if (selectedContract === 'select') {
            return; // Do not proceed further if "Select Contract" is chosen
        }

        // Show the selected contract's details, corresponding header, and dynamic info
        document.getElementById(`${selectedContract}Details`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
        if (selectedContract === 'contract1') {
            contract1InfoHeader.style.display = 'block';
            contract1DynamicInfo.style.display = 'block';
            fetchContract1Info(account);
        } else if (selectedContract === 'contract2') {
            contract2InfoHeader.style.display = 'block';
            contract2DynamicInfo.style.display = 'block';
            fetchContract2Info(account);
        }
    });

    // Initialize display based on the currently selected contract
    if (contractSelect.value !== 'select') {
        document.getElementById(`${contractSelect.value}Details`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
        if (contractSelect.value === 'contract1') {
            contract1InfoHeader.style.display = 'block';
            contract1DynamicInfo.style.display = 'block';
            fetchContract1Info(account);
        } else if (contractSelect.value === 'contract2') {
            contract2InfoHeader.style.display = 'block';
            contract2DynamicInfo.style.display = 'block';
            fetchContract2Info(account);
        }
    }
}
}




// Event listener for the connect wallet button
document.getElementById('connectWallet').addEventListener('click', connectWallet);



// Event listener for the Contract 1 Timelock button
const timelock1Button = document.getElementById('timelock1Button');
if (timelock1Button) {
timelock1Button.addEventListener('click', function() {
    const amount = Number(document.getElementById('amount1').value) * 100000000;
    timelockTokens(contract1Address, amount);
});
}

// Event listener for the Contract 1 Withdraw button

const withdraw1Button = document.getElementById('withdraw1Button');
if (withdraw1Button) {
withdraw1Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount1').value);
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
    withdrawTokensContract1(amount);
});
}


// Event listener for the Contract 2 Timelock button
const timelock2Button = document.getElementById('timelock2Button');
if (timelock2Button) {
timelock2Button.addEventListener('click', function() {
    const amount = Number(document.getElementById('amount2').value) * 100000000;
    timelockTokens(contract2Address, amount);
});
}

// Event listener for the Contract 2 Withdraw button
const withdraw2Button = document.getElementById('withdraw2Button')
if (withdraw2Button) {
withdraw2Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount2').value) * 100000000;
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
    withdrawTokensContract2(amount);
});
}

// Event listener for the Contract 2 Giveaway button
const giveaway2Button = document.getElementById('giveaway2Button')
if (giveaway2Button) {
giveaway2Button.addEventListener('click', function() {
    const addresses = document.getElementById('ethAddresses').value.trim().split('\n');
    const amountsText = document.getElementById('giveawayAmounts').value.trim().split('\n');
    const amounts = amountsText.map(amount => Number(amount) * 100000000);
    if (addresses.length !== amounts.length) {
        console.error('The number of addresses and amounts does not match.');
        return;
    }
    giveawayTokens(contract2Address, addresses, amounts);
});
}








// Function to timelock tokens
function timelockTokens(contractAddress, amount) {
    // Interact with BSOV Token contract to call approveAndCall
    // Example:
     const bsovTokenContract = new web3.eth.Contract(bsovTokenABI, bsovTokenAddress);
     bsovTokenContract.methods.approveAndCall(contractAddress, amount, "0x").send({ from: selectedAccount });
}



async function executeTransactionIfFeeIsAcceptable(contractMethod, args, fromAddress) {
    const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH
    const estimatedGas = await contractMethod.estimateGas(...args, { from: fromAddress });
    const gasPrice = await web3.eth.getGasPrice();

    const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
    const highFeeThreshold = BigInt(HIGH_FEE_THRESHOLD);

    if (estimatedFee > highFeeThreshold) {
        throw new Error("HighFees");
    }

    console.log("Initiating Transaction...");
    return contractMethod.send(...args, { from: fromAddress });
}


// Function to withdraw tokens from Contract 1
async function withdrawTokensContract1(amount) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract1) {
        console.error('Contract 1 is not initialized for withdrawal');
        return;
    }

    const transaction = window.contract1.methods.withdraw(amount);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the unlock date has been reached, or you are trying to withdraw/timelock too many tokens.';
        } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = 'Transaction failed. Please try again.';
        }
    }
}


// Function to withdraw tokens from Contract 2
async function withdrawTokensContract2(amount) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for withdrawal');
        return;
    }

    const transaction = window.contract2.methods.withdraw(amount);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the unlock date has been reached, or you are trying to withdraw/timelock too many tokens.';
        } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = 'Transaction failed. Please try again.';
        }
    }
}


// Function for giveaway tokens
async function giveawayTokens(contractAddress, addresses, amounts) {
    document.getElementById('errorMessage').innerText = '';

    // Validate Addresses and Amounts
    const isValidAddresses = addresses.every(address => web3.utils.isAddress(address));
    const isValidAmounts = amounts.every(amount => !isNaN(amount) && amount > 0);

    if (!isValidAddresses || !isValidAmounts) {
        document.getElementById('errorMessage').innerText = 'Please enter valid Ethereum addresses and amounts.';
        return;
    }

    if (!window.contract2) {
        console.error('Contract 2 is not initialized for giveaway');
        return;
    }

    const transaction = window.contract2.methods.giveawayTimeLockedTokens(addresses, amounts);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Giveaway transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Please check your transaction parameters.';
        } else {
            console.error("Error in giveaway transaction: ", error);
            document.getElementById('errorMessage').innerText = 'Transaction failed. Please try again.';
        }
    }
}


function resetContractUI() {
    // Hide all buttons and input fields
    document.getElementById('amount1').style.display = 'none';
    document.getElementById('amount2').style.display = 'none';
    document.getElementById('ethAddresses').style.display = 'none';
    document.getElementById('giveawayAmounts').style.display = 'none';
    document.getElementById('timelock1Button').style.display = 'none';
    document.getElementById('withdraw1Button').style.display = 'none';
    document.getElementById('timelock2Button').style.display = 'none';
    document.getElementById('withdraw2Button').style.display = 'none';
    document.getElementById('giveaway2Button').style.display = 'none';
   
}

// When a new contract is selected
const contractSelect = document.getElementById('contractSelect');
if (contractSelect) {
contractSelect.addEventListener('change', function(event) {
    resetContractUI(); // Call this to reset the UI elements
    // ... rest of your existing change handler logic ...
});
}

// Show the corresponding input field when a radio button is clicked for Contract 1
document.querySelectorAll('input[name="contract1Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide both amount input and buttons first
	resetContractUI(); // Call this to reset the UI elements
        document.getElementById('amount1').style.display = 'none';
        document.getElementById('timelock1Button').style.display = 'none';
        document.getElementById('withdraw1Button').style.display = 'none';

        // Show the corresponding input field and button
        document.getElementById('amount1').style.display = 'block'; // Show the amount field for both actions
        if (radio.value === 'timelock') {
            document.getElementById('timelock1Button').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('withdraw1Button').style.display = 'block';
        }
    });
});

// Show the corresponding input field and/or textarea when a radio button is clicked for Contract 2
document.querySelectorAll('input[name="contract2Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide all amount inputs, textarea, and buttons first
	resetContractUI(); // Call this to reset the UI elements
        document.getElementById('amount2').style.display = 'none';
        document.getElementById('ethAddresses').style.display = 'none';
	document.getElementById('giveawayAmounts').style.display = 'none';
        document.getElementById('timelock2Button').style.display = 'none';
        document.getElementById('withdraw2Button').style.display = 'none';
        document.getElementById('giveaway2Button').style.display = 'none';

        // Show the corresponding input field and/or textarea and button
        if (radio.value === 'timelock') {
            document.getElementById('amount2').style.display = 'block';
            document.getElementById('timelock2Button').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('amount2').style.display = 'block';
            document.getElementById('withdraw2Button').style.display = 'block';
        } else if (radio.value === 'giveaway') {
            document.getElementById('ethAddresses').style.display = 'block';
	    document.getElementById('giveawayAmounts').style.display = 'block';
            document.getElementById('giveaway2Button').style.display = 'block';
        }
    });
});


// const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH

async function handleWithdraw() {
    const selectedContract = document.getElementById('contractSelect').value;
    let contractInstance;
    let amountInputId;

    // Determine which contract is selected and set the corresponding contract instance and input ID
    if (selectedContract === 'contract1') {
        contractInstance = window.contract1;
        amountInputId = 'amount1';
    } else if (selectedContract === 'contract2') {
        contractInstance = window.contract2;
        amountInputId = 'amount2';
    } else {
        alert('Please select a contract.');
        return;
    }

    // Ensure the contract instance is available
    if (!contractInstance) {
        console.error('Selected contract is not initialized.');
        alert('Selected contract is not initialized.');
        return;
    }




}



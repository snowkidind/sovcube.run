// app.js

document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');

    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
});

const contract1Address = '0xEb70EE5a2a46F186C966C3c877Dbdc4a47cD07aD'; // Replace with actual Contract 1 address
const contract2Address = '0x96AD86E3Cf2f0fFf3F8A96155Fd8c87A096F7a8d'; // Replace with actual Contract 2 address
const tokenContractAddress = '0x40019c75dd9fF27d5cD182F9034D67a6b754308B';
const giveawayReserveContractAddress = '0x704a9A74eB690b337E4A72376c5E6CFF0d9AAA6E';

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
console.log('Function toggleConnectButtonText started');
    const connectButton = document.getElementById('connectWallet');
    if (selectedAccount) {
        connectButton.innerText = 'Disconnect Wallet';
    } else {
        connectButton.innerText = 'Connect to Wallet';
    }
}

// Function to handle wallet connection
async function connectWallet() {
console.log('connectWallet Function started');
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
	  // updateUIForConnectedWallet(selectedAccount);
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}


function updateUIForDisconnectedWallet() {
console.log('updateUIForDisconnectedWallet Function started');
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
  //  const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const connectYourWalletText = document.getElementById('connectYourWalletText');
    const withdraw1 = document.getElementById('withdraw1');
   

     if (withdraw1) withdraw1.style.display = 'none';
    if (contractSelect) contractSelect.style.display = 'none';
    if (contract1InfoHeader) contract1InfoHeader.style.display = 'none';
    if (contract2InfoHeader) contract2InfoHeader.style.display = 'none';
    if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'none';
  //  if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'none';
    if (contractInfoContainer) contractInfoContainer.style.display = 'none';
    if (connectYourWalletText) connectYourWalletText.style.display = 'block';

     resetContractUI(); // Make sure this function also hides relevant elements correctly
     contract1Details.style.display = 'none';
     contract2Details.style.display = 'none';
     contract1Explanation.style.display = 'none';
     contract2Explanation.style.display = 'none';
     fieldContainer.style.display = 'none';
     connectYourWalletText.style.display = 'block';
}


// Function to update UI after connecting the wallet
function updateUIForConnectedWallet(account) {
console.log('updateUIForConnectedWallet Function started');
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = `Connected to ${account}`;
    walletStatus.style.color = '#2CB723';
    toggleConnectButtonText();
    updateUIOnConnection(selectedAccount);
}




async function checkWalletConnection() {
console.log('checkWalletConnection Function started');
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




// Function to update the UI after wallet connection
function updateUIOnConnection(account) {
console.log('updateUIOnConnection Function started');
    console.log(`Connected to account: ${account}`);
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
 //   const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const withdraw1 = document.getElementById('withdraw1');
    const withdraw2 = document.getElementById('withdraw2');
    const timelock1 = document.getElementById('timelock1');
    const timelock2 = document.getElementById('timelock2');
    const giveaway = document.getElementById('giveaway');
    

if (contractSelect)  {
document.querySelector('.contract-selection').style.display = 'block';
contractSelect.style.display = 'block';

   connectYourWalletText.style.display = 'none';
document.getElementById(`fieldContainer`).style.display = 'none';

    contractSelect.addEventListener('change', function(event) {
        const selectedContract = event.target.value;

        // Hide all contract details, headers, and dynamic info first
	    
        document.getElementById('contract1Details').style.display = 'none';
        document.getElementById('contract2Details').style.display = 'none';
        document.getElementById('contract1Explanation').style.display = 'none';
	document.getElementById('contract2Explanation').style.display = 'none';
	contract1InfoHeader.style.display = 'none';
        contract2InfoHeader.style.display = 'none';
        contract1DynamicInfo.style.display = 'none';
        document.getElementById('contract2InfoSection').style.display = 'none';
    //    contract2DynamicInfo.style.display = 'none';
        contractInfoContainer.style.display = 'none';
	contractSelect.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'block';
	document.getElementById(`account-checkbox`).style.display = 'none';
        document.getElementById(`account-checkbox-label`).style.display = 'none';
document.getElementById('contract-explanation').style.display = 'block';	

        if (selectedContract === 'select') {
           document.getElementById(`fieldContainer`).style.display = 'none';
		document.getElementById('contract-explanation').style.display = 'block';
            return; // Do not proceed further if "Select Contract" is chosen
        }

        // Show the selected contract's details, corresponding header, and dynamic info
        document.getElementById(`${selectedContract}Details`).style.display = 'block';
	document.getElementById(`${selectedContract}Explanation`).style.display = 'block';
	 document.getElementById(`fieldContainer`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
        if (selectedContract === 'contract1') {
            contract1InfoHeader.style.display = 'block';
            contract1DynamicInfo.style.display = 'block';
            withdraw1.style.display = 'block';
	    timelock1.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
	document.getElementById(`fieldContainer`).style.display = 'block';
		document.getElementById(`claimGiveawayButton`).style.display = 'none';
            fetchContract1Info(account);
        } else if (selectedContract === 'contract2') {
            contract2InfoHeader.style.display = 'block';
		document.getElementById('contract2InfoSection').style.display = 'block';
        //    contract2DynamicInfo.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
	    withdraw2.style.display = 'block';
	    timelock2.style.display = 'block';
	    giveaway.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'block';
		document.getElementById(`claimGiveawayButton`).style.display = 'block';
            fetchContract2Info(account);
        }
    });

    // Initialize display based on the currently selected contract
    if (contractSelect.value !== 'select') {
        document.getElementById(`${contractSelect.value}Details`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'none';
	    document.getElementById('contract-explanation').style.display = 'block';
        if (contractSelect.value === 'contract1') {
	document.getElementById(`fieldContainer`).style.display = 'block';
            contract1InfoHeader.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
            contract1DynamicInfo.style.display = 'block';
		document.getElementById(`claimGiveawayButton`).style.display = 'none';
            fetchContract1Info(account);
        } else if (contractSelect.value === 'contract2') {
	document.getElementById(`fieldContainer`).style.display = 'block';
            contract2InfoHeader.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
        //    contract2DynamicInfo.style.display = 'block';
		document.getElementById(`claimGiveawayButton`).style.display = 'block';
            fetchContract2Info(account);
        }

    }

 }

}


function radioButtonUIResponse() {

// Show the corresponding input field when a radio button is clicked for Contract 1
document.querySelectorAll('input[name="contract1Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide both amount input and buttons first
        resetContractUI(); // Call this to reset the UI elements
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

        // Show the corresponding input field and/or textarea and button
        if (radio.value === 'timelock') {
            document.getElementById('amount2').style.display = 'block';
            document.getElementById('timelock2Button').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('amount2').style.display = 'block';
            document.getElementById('withdraw2Button').style.display = 'block';
		        document.getElementById(`account-checkbox`).style.display = 'block';
        document.getElementById(`account-checkbox-label`).style.display = 'block';
        } else if (radio.value === 'giveaway') {
            document.getElementById('ethAddresses').style.display = 'block';
            document.getElementById('giveawayAmounts').style.display = 'block';
            document.getElementById('giveaway2Button').style.display = 'block';
        }
    });
});
}
radioButtonUIResponse();


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
    const amountInput = Number(document.getElementById('amount2').value);
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
	document.getElementById('errorMessage').innerText = `The number of addresses and amounts does not match.`;
	    document.getElementById('clearError').style.display = 'block';
return;
    }
    earmarkTokensForGiveaway(addresses, amounts);
});
}

async function executeTransactionIfFeeIsAcceptable(contractMethod, args, fromAddress) {
    const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH
    const estimatedGas = await contractMethod.estimateGas(...args, { from: fromAddress });
    const gasPrice = await web3.eth.getGasPrice();

    const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
    const highFeeThreshold = BigInt(HIGH_FEE_THRESHOLD);
    console.log('Estimated Fee: ' + estimatedFee);
    console.log("Highest Fee Threshold: " + highFeeThreshold);
    if (estimatedFee > highFeeThreshold) {
        throw new Error("HighFees");
    }

    console.log("Initiating Transaction...");
    return contractMethod.send(...args, { from: fromAddress });
}


const claimGiveawayReserveButton = document.getElementById('claimGiveawayReserveButton');
if (claimGiveawayReserveButton) {
    claimGiveawayReserveButton.addEventListener('click', function() {
        claimGiveawayReserveTokens();
    });
}

// Function to claim giveaway tokens
async function claimGiveawayReserveTokens() {
    if (!window.giveawayReserve) {
        console.error('GiveawayReserve is not initialized for claiming tokens');
        return;
    }
    const transaction = window.giveawayReserve.methods.claimGiveawayReserve();

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
}
}


const claimGiveawayButton = document.getElementById('claimGiveawayButton');
if (claimGiveawayButton) {
    claimGiveawayButton.addEventListener('click', function() {
        claimGiveawayTokens();
    });
}


// Function to accept received tokens
async function claimGiveawayTokens() {
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for claiming tokens');
        return;
    }
    const transaction = window.contract2.methods.claimGiveawayTokens();

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
 }
}


async function timelockTokens(contractAddress, amount) {
    
        const bsovTokenContract = new web3.eth.Contract(bsovTokenABI, bsovTokenAddress);
        const transaction = bsovTokenContract.methods.approveAndCall(contractAddress, amount, "0x");
    try {
throw new Error("Test Error");
        // Use the executeTransactionIfFeeIsAcceptable function to execute the transaction
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        // Check if the error is the custom "HighFees" error
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
		document.getElementById('clearError').style.display = 'block';
        } else {
            // Handle other errors
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
		document.getElementById('clearError').style.display = 'block';
}
    }
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
		document.getElementById('clearError').style.display = 'block';
 } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
	 document.getElementById('clearError').style.display = 'block';
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
    const fromGiveaway = document.getElementById('account-checkbox').checked;
    const transaction = window.contract2.methods.withdraw(amount, fromGiveaway);
    //const transaction = window.contract2.methods.withdraw(amount);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the unlock date has been reached, or you are trying to withdraw/timelock too many tokens.';
		document.getElementById('clearError').style.display = 'block';
} else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
	document.getElementById('clearError').style.display = 'block';
}
    }
}


// Function for earmarking tokens for giveaway
async function earmarkTokensForGiveaway(addresses, amounts) {
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for earmarking tokens');
        return;
    }

    // Validate Addresses and Amounts
    const isValidAddresses = addresses.every(address => web3.utils.isAddress(address));
    const isValidAmounts = amounts.every(amount => !isNaN(amount) && amount > 0);

    if (!isValidAddresses || !isValidAmounts) {
        document.getElementById('errorMessage').innerText = 'Please enter valid Ethereum addresses and amounts.';
	    document.getElementById('clearError').style.display = 'block';
 return;
    }

    const transaction = window.contract2.methods.markTokensForGiveaway(addresses, amounts);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Earmark transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in earmarking transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
}
}



function resetContractUI() {

console.log('resetContractUI Function started');
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
document.getElementById('contract-explanation').style.display = 'none';
	document.getElementById('errorMessage').innerText = '';
	document.getElementById(`clearError`).style.display = 'none';
	document.getElementById(`account-checkbox`).style.display = 'none';
        document.getElementById(`account-checkbox-label`).style.display = 'none';

// When a new contract is selected
const contractSelect = document.getElementById('contractSelect');
if (contractSelect) {
contractSelect.addEventListener('change', function(event) {
 //   resetContractUI(); // Call this to reset the UI elements
    
});
}


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
   }

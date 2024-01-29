let web3;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    alert('You need to install MetaMask to read the updated data. Please consider installing it: https://metamask.io/download.html');
}

let contract1;
let contract2;
let bsovTokenContract;
let rewardsReserve;

// Function to initialize the bsovTokenContract contract
function initBsovTokenContract(abi, contractAddress) {
    bsovTokenContract = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize contract1
function initContract1(abi, contractAddress) {
    contract1 = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize contract2
function initContract2(abi, contractAddress) {
    contract2 = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize the rewardsReserve contract
function initRewardsReserveContract(abi, contractAddress) {
    rewardsReserve = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize the rewardsReserve contract
function initRewardsReserveContract(abi, contractAddress) {
    rewardsReserve = new web3.eth.Contract(abi, contractAddress);
}

// Function to load the contract ABI and return a Promise
function loadABI(file) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const abi = JSON.parse(xhr.responseText);
                resolve(abi);
            } else if (xhr.readyState === 4) {
                reject(new Error(`Failed to load ABI from ${file}`));
            }
        };
        xhr.send();
    });
}

// Initialize contracts using async/await
async function initializeContracts() {
    try {
        const contract1ABI = await loadABI('/dapp/contract1.abi');
        const contract2ABI = await loadABI('/dapp/contract2.abi');
        const tokenContractABI = await loadABI('/dapp/bsov.abi');
        const rewardsReserveABI = await loadABI('/dapp/rewardsReserve.abi');

 	initContract1(contract1ABI, contract1Address); // Initialize contract1
        initContract2(contract2ABI, contract2Address); // Initialize contract2
        initBsovTokenContract(tokenContractABI, tokenContractAddress); // Initialize bsovTokenContract
        initRewardsReserveContract(rewardsReserveABI, rewardsReserveContractAddress);
        
	    // Now that contracts are initialized, you can update their data
        updateData();
    } catch (error) {
        console.error(error);
    }
}


// Helper function to update contract data on the page
function updateContractData(contract, methodName, containerId, methodArgs) {
    // contract.methods[methodName](...methodArgs)
	
const containerLabels = {
  contract1TimeLeft: "Time Remaining of Lock Time",
  contract2TimeLeft: "Time Remaining of Lock Time",
  rewardsReserveCurrentTier: "Current Reward Tier",
  rewardsReserveTotalClaimed: "Total Rewards Claimed",
  rewardsReserveTotalEligibleAmount: "Total Rewards Sent",
  rewardsReserveTotalTimelocked: "Total BSOV Timelocked for Rewards",
  tokensMinted: "Total BSOV Tokens Minted",
  burnAmount: "Total BSOV Burned"
};

const containerLabel = containerLabels[containerId] || 'Unknown Container';


let methodCall;
    if (methodArgs && methodArgs.length > 0) {
        methodCall = contract.methods[methodName](...methodArgs);
    } else {
        methodCall = contract.methods[methodName]();
    }
methodCall
        .call()
        .then((result) => {
            let formattedResult = Number(result);

            // Format specific contract data
            if (methodName === 'tokensMinted' || methodName === 'totalClaimed' || methodName === 'totalEligibleAmount' || methodName === 'totalTimelocked' || methodName === 'balanceOf') {
            formattedResult = (formattedResult / 100000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " BSOV";
		  //  formattedResult = (formattedResult / 100000000).toFixed(8); // Divide by 100000000 for 8 decimal places
            } else if (methodName === 'getTimeLeft') {
                formattedResult = formatTime(formattedResult); // Format time as countdown
            }


// const containerLabel = containerLabels[containerId] || 'Unknown Container';
            document.getElementById(containerId).innerHTML = `<p><b>${containerLabel}:</b><br>${formattedResult}</p>`;
        })
        .catch((error) => {
	
            // console.error(error);
if (error.message.includes('future is here') || error.message.includes('Tokens are unlocked')) {
            // Show 'Unlocked!' text in green color
            document.getElementById(containerId).innerHTML = `<p><b>${containerLabel}:</b><br><span style="color: green;">Unlocked!</span></p>`;
	    } else {	    
            document.getElementById(containerId).innerHTML = `<p><b>${containerLabel}:</b><br> Error</p>`;
         }
	    });
}


function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}


// Function to update contract data
function updateData() {
    // Update data for bsovTokenContract
    updateContractData(bsovTokenContract, 'tokensMinted', 'tokensMinted');
    updateContractData(bsovTokenContract, 'balanceOf', 'burnAmount', ["0x0000000000000000000000000000000000000000"]);
    // Update data for contract1
    updateContractData(contract1, 'getTimeLeft', 'contract1TimeLeft');
 //   updateContractData(contract1, 'getTotalTimelocked', 'contract1TotalTimelocked');
  //  updateContractData(contract1, 'getUsersInfo', 'contract1UsersInfo');

    // Update data for contract2
    updateContractData(contract2, 'getTimeLeft', 'contract2TimeLeft');
  //  updateContractData(contract2, 'getTotalTimelocked', 'contract2TotalTimelocked');
  //  updateContractData(contract2, 'getUsersInfo', 'contract2UsersInfo');

    // Update data for rewardsReserve
    updateContractData(rewardsReserve, 'currentTier', 'rewardsReserveCurrentTier');
    updateContractData(rewardsReserve, 'totalClaimed', 'rewardsReserveTotalClaimed');
    updateContractData(rewardsReserve, 'totalEligibleAmount', 'rewardsReserveTotalEligibleAmount');
    updateContractData(rewardsReserve, 'totalTimelocked', 'rewardsReserveTotalTimelocked');
}

// Call the initializeContracts function to start the process
initializeContracts();


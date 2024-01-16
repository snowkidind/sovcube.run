// giveaway-progress.js


// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
}


let giveawayReserve; // Define giveawayReserve in a broader scope

// Function to initialize the giveawayReserve contract
function initGiveawayReserveContract(abi, contractAddress) {
    giveawayReserve = new web3.eth.Contract(abi, contractAddress);
}

// Function to load the contract ABI
function loadABI(file, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const abi = JSON.parse(xhr.responseText);
            callback(abi);
        }
    };
    xhr.send();
}


// Function to update the progress bar
function updateProgressBar(totalTimelocked, totalEligibleAmount) {
    const progressBarElement = document.getElementById('giveawayProgressBar');
    const currentProgressElement = progressBarElement.querySelector('.current-progress');

    // Convert the values to Numbers for arithmetic operations
    const totalTimelockedNum = Number(totalTimelocked);
    const totalEligibleAmountNum = Number(totalEligibleAmount);
    const formattedTotalEligibleAmountNum = totalEligibleAmountNum / 100000000; 
    const formattedTotalTimelockedNum = totalTimelockedNum / 100000000;
    const formattedTimelockLimit = 1500000

    // Calculate the width of the progress bar based on the total timelocked and eligible amount
    const progressPercent = (formattedTotalTimelockedNum / 1500000) * 100;
    currentProgressElement.style.width = progressPercent + '%';
    
    // Update the tooltip with the current progress
    progressBarElement.setAttribute('data-tooltip', `This many tokens have been timelocked already: ${formattedTotalTimelockedNum.toLocaleString()} BSOV of a maximum of ${formattedTimelockLimit.toLocaleString()} BSOV. The red markers indicate the advancement to the next tier.`);

 // Update the Total Timelocked Tokens display
    const totalTimelockedDisplayElement = document.getElementById('totalTimelockedAmount');
    totalTimelockedDisplayElement.textContent = (Number(totalTimelocked) / 1e8).toLocaleString() + ` BSOV`; // Assuming 8 decimal places for your token

    // Update the Total Rewards Sent display
    const totalRewardsSentDisplayElement = document.getElementById('totalRewardsSentAmount');
    totalRewardsSentDisplayElement.textContent = (Number(totalEligibleAmount) / 1e8).toLocaleString() + ` BSOV`; // Assuming 8 decimal places for your token
}

async function updateCurrentTierDisplay() {
    if (!giveawayReserve) {
        console.error('Giveaway Reserve contract is not initialized');
        return;
    }

    try {
        const currentTier = await giveawayReserve.methods.currentTier().call();

        // Update the Current Tier display
        const currentTierDisplayElement = document.getElementById('currentTier');
        currentTierDisplayElement.textContent = currentTier;
    } catch (error) {
        console.error("Error fetching the current tier from the Giveaway Reserve contract:", error);
        const currentTierDisplayElement = document.getElementById('currentTier');
        currentTierDisplayElement.textContent = "Error";
    }
}


// Function to fetch and update the progress bar information
async function fetchAndUpdateProgressBar() {
    if (!giveawayReserve) {
        console.error('Giveaway Reserve contract is not initialized');
        return;
    }

    try {
        const totalTimelocked = await giveawayReserve.methods.totalTimelocked().call();
        const totalEligibleAmount = await giveawayReserve.methods.totalEligibleAmount().call();
        
        updateProgressBar(totalTimelocked, totalEligibleAmount);
    } catch (error) {
        console.error("Error fetching data from the Giveaway Reserve contract:", error);
    }
}

// Load the Giveaway Reserve ABI and initialize the contract
loadABI('/dapp/giveawayReserve.abi', function(abi) {
    initGiveawayReserveContract(abi, '0x42cD04F973B73b459376fAb0af364fDE86899eAe'); // Replace with your actual contract address
    fetchAndUpdateProgressBar(); // Fetch and update progress bar after initializing the contract
    updateCurrentTierDisplay();
});

// Set an interval to regularly update the progress bar
setInterval(fetchAndUpdateProgressBar, 30000); // Update every 30 seconds
setInterval(updateCurrentTierDisplay, 30000); // Update every 30 seconds


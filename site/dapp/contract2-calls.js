// contract2-calls.js

let contract2; // Define contract2 in a broader scope
let giveawayReserve;

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

// Load ABI and Initialize contract2
if (web3) {
    loadABI('/dapp/contract2.abi', function(abi) {
        window.contract2 = new web3.eth.Contract(abi, contract2Address);
	contract2 = new web3.eth.Contract(abi, contract2Address);
    });
    loadABI('/dapp/giveawayReserve.abi', function(abi) {
        giveawayReserve = new web3.eth.Contract(abi, giveawayReserveContractAddress);
    window.giveawayReserve = new web3.eth.Contract(abi, giveawayReserveContractAddress);
    });
}
/*
function secondsToDays(seconds) {
    return Math.floor(seconds / (24 * 60 * 60));
}
*/

/*function secondsToDays(seconds) {
    const oneDayInSeconds = BigInt(24 * 60 * 60);
    return Number(seconds / oneDayInSeconds);
}
*/

function formatTimeLeft(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}


async function getContract2TimelockedTokens(account) {
    if (!contract2) {
        console.error('Contract2 is not initialized when fetching timelocked tokens');
        return;
    }
    const unclaimedGiveawayTokens = await contract2.methods.getUnclaimedGiveawayBalance(account).call();
    const timelockedTokens = await contract2.methods.getBalance(account).call();
    const timelockedGiveawayTokens = await contract2.methods.getGiveawayBalance(account).call();
    // const timeLeftInSeconds = await contract2.methods.getTimeLeft().call();
    // const giveawayUnlockTimeInSeconds = await contract2.methods.getGiveawayTimeLeft(account).call();

let timeLeftInSeconds, giveawayUnlockTimeInSeconds;
          try {
            timeLeftInSeconds = await contract2.methods.getTimeLeft().call();
            giveawayUnlockTimeInSeconds = await contract2.methods.getGiveawayTimeLeft(account).call();
        } catch (error) {
            console.error("Time Left Error:", error.message);
            timeLeftInSeconds = 0; // Set to 0 or a suitable default value
            giveawayUnlockTimeInSeconds = 0; // Set to 0 or a suitable default value
        }

    return { timelockedTokens, timelockedGiveawayTokens, unclaimedGiveawayTokens, timeLeftInSeconds, giveawayUnlockTimeInSeconds };
}


// Function to fetch information related to Giveaway Reserve

async function fetchGiveawayReserveInfo(account) {
    if (!giveawayReserve) {
        console.error('Giveaway Reserve contract is not initialized');
	    return;
    }
        const eligibleTokens = await giveawayReserve.methods.eligibleAmount(account).call();
        return eligibleTokens;
	
}	

/*
function fetchContract2Info(account) {
    console.log("Fetching Contract 2 info for account:", account);
    getContract2TimelockedTokens(account).then(({ timelockedTokens, timelockedGiveawayTokens, unclaimedGiveawayTokens, timeLeftInSeconds, giveawayUnlockTimeInSeconds, eligibleTokens }) => {
        console.log("Contract 2 Timelocked Tokens:", timelockedTokens);
        console.log("Contract 2 Giveaway Timelocked Tokens:", timelockedGiveawayTokens);
	const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(8); // Format to 8 decimal places
        const formattedGiveawayTokens = (Number(timelockedGiveawayTokens) / 100000000).toFixed(8); // Format to 8 decimal places
	const formattedUnclaimedGiveawayTokens = (Number(unclaimedGiveawayTokens) / 100000000).toFixed(8); // Format to 8 decimal places
	//const timeLeftInDays = secondsToDays(timeLeftInSeconds);
        const formattedTimeLeft = formatTimeLeft(Number(timeLeftInSeconds));
	const formattedGiveawayUnlockTime = formatTimeLeft(Number(giveawayUnlockTimeInSeconds));

	 //   updateContract2Details(formattedTokens, formattedGiveawayTokens, formattedUnclaimedGiveawayTokens, formattedTimeLeft, formattedGiveawayUnlockTime, '16 September 2026', 100, formattedEligibleTokens);
    }).catch(error => {
        console.error("Error in fetching Contract 2 Timelocked Tokens:", error);
    });
    
    fetchGiveawayReserveInfo(account).then (({ eligibleTokens }) => {
	const formattedEligibleTokens = (Number(eligibleTokens) / 100000000).toFixed(8); // Format to 8 decimal places
    }).catch(error => {
	console.error("Error in fetching Giveaway Reserve Contract's Eligible Tokens", error);
    });

updateContract2Details(formattedTokens, formattedGiveawayTokens, formattedUnclaimedGiveawayTokens, formattedTimeLeft, formattedGiveawayUnlockTime, '16 September 2026', 100, formattedEligibleTokens);

}*/

async function fetchContract2Info(account) {
    console.log("Fetching Contract 2 info for account:", account);
    try {
        const { timelockedTokens, timelockedGiveawayTokens, unclaimedGiveawayTokens, timeLeftInSeconds, giveawayUnlockTimeInSeconds } = await getContract2TimelockedTokens(account);
        const eligibleTokens = await fetchGiveawayReserveInfo(account);

        const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(2);
        const formattedGiveawayTokens = (Number(timelockedGiveawayTokens) / 100000000).toFixed(2);
        const formattedUnclaimedGiveawayTokens = (Number(unclaimedGiveawayTokens) / 100000000).toFixed(2);
        const formattedTimeLeft = formatTimeLeft(Number(timeLeftInSeconds));
        const formattedGiveawayUnlockTime = formatTimeLeft(Number(giveawayUnlockTimeInSeconds));
        const formattedEligibleTokens = (Number(eligibleTokens) / 100000000).toFixed(2);

	    

        updateContract2Details(formattedTokens, formattedGiveawayTokens, formattedUnclaimedGiveawayTokens, formattedTimeLeft, formattedGiveawayUnlockTime, '16 September 2026', 100, formattedEligibleTokens);
    } catch (error) {
        console.error("Error in fetching Contract 2 info:", error);
    }
}





function updateContract2Details(tokensLocked, tokensGiveawayLocked, unclaimedGiveawayTokens, formattedTimeLeft, formattedGiveawayUnlockTime, unlockTime, withdrawRate, formattedEligibleTokens) {
	
	const mainContractInfoElement = document.getElementById('mainContractInfo');
    mainContractInfoElement.innerHTML = `
<p id="contractDescription"><b>Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
        `;


	const giveawayAccountElement = document.getElementById('giveawayAccount');
    giveawayAccountElement.innerHTML = `
	<h3 style="color:orange; border-bottom:1px solid orange;">Giveaway</h3>	
	<p><b>Unclaimed Giveaway Rewards:</b> ${formattedEligibleTokens} BSOV</p>
	`;



	const regularAccountElement = document.getElementById('regularAccount');
    regularAccountElement.innerHTML = `
        <h3>Regular Account</h3>
        <p><b>Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
        <p style="margin-top:10px;"><b>Unlock Date:</b><br>${formattedTimeLeft}</p>
    `;

    // Update Incoming Tokens Account Info
    const incomingTokensAccountElement = document.getElementById('incomingTokensAccount');
    incomingTokensAccountElement.innerHTML = `
        <h3>Incoming Tokens Account</h3>
        <p><b>Timelocked Tokens:</b> <span id="yourTokensText">${tokensGiveawayLocked} BSOV</span></p>
        <p><b>Unlock Time:</b> ${formattedGiveawayUnlockTime}</p>
        <p style="margin-top:10px;"><b>Incoming Tokens:</b> <span id="unclaimedTokens">${unclaimedGiveawayTokens} BSOV</span></p>
    `;
}





/*
setInterval(function() {
    if (selectedAccount) {
        fetchContract2Info(selectedAccount);
    fetchContract1Info(selectedAccount);
    }
}, 15000);
*/

let fetchInterval;

function startFetching() {
    fetchInterval = setInterval(function() {
        if (!document.hidden && selectedAccount) {
            fetchContract2Info(selectedAccount);
            fetchContract1Info(selectedAccount);
        }
    }, 5000);
}

function stopFetching() {
    clearInterval(fetchInterval);
}

// Start fetching when the window gains focus
window.onfocus = startFetching;

// Stop fetching when the window loses focus
window.onblur = stopFetching;

// Also start fetching when the page initially loads
startFetching();



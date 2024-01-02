// contract2-calls.js

let contract2; // Define contract2 in a broader scope

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
}

async function getContract2TimelockedTokens(account) {
    if (!contract2) {
        console.error('Contract2 is not initialized when fetching timelocked tokens');
        return;
    }
    const timelockedTokens = await contract2.methods.getBalance(account).call();
    return timelockedTokens;
}

function fetchContract2Info(account) {
    console.log("Fetching Contract 2 info for account:", account);
    getContract2TimelockedTokens(account).then(timelockedTokens => {
        console.log("Contract 2 Timelocked Tokens:", timelockedTokens);
        const formattedTokens = Number(timelockedTokens) / 100000000;
        updateContract2Details(formattedTokens, '16 September 2026', 100);
    }).catch(error => {
        console.error("Error in fetching Contract 2 Timelocked Tokens:", error);
    });
}


function updateContract2Details(tokensLocked, unlockTime, withdrawRate) {
    const infoElement = document.getElementById('contract2DynamicInfo');
    infoElement.innerHTML = `<b>Your Timelocked Tokens:</b> <span id="yourTokensText">${tokensLocked} BSOV</span>, <br><br><b>Unlock Date:</b> ${unlockTime}, <br><b>Slow-Release Withdrawal Rate:</b> ${withdrawRate} tokens/week`;
}



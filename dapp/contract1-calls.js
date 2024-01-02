// contract1-calls.js

let contract1; // Define contract1 in a broader scope

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

// Load ABI and Initialize contract1
if (web3) {
    loadABI('/dapp/contract1.abi', function(abi) {
        window.contract1 = new web3.eth.Contract(abi, contract1Address);
	contract1 = new web3.eth.Contract(abi, contract1Address);
    });
}

async function getContract1TimelockedTokens(account) {
    if (!contract1) {
        console.error('Contract1 is not initialized when fetching timelocked tokens');
        return;
    }
    const timelockedTokens = await contract1.methods.getBalance(account).call();
    return timelockedTokens;
}




function fetchContract1Info(account) {
    console.log("Fetching Contract 1 info for account:", account);
    getContract1TimelockedTokens(account).then(timelockedTokens => {
        console.log("Contract 1 Timelocked Tokens:", timelockedTokens);
        const formattedTokens = Number(timelockedTokens) / 100000000;
        updateContract1Details(formattedTokens, '29 January 2020', 1000);
    }).catch(error => {
        console.error("Error in fetching Contract 1 Timelocked Tokens:", error);
    });
}



function updateContract1Details(tokensLocked, unlockTime, withdrawRate) {
    const infoElement = document.getElementById('contract1DynamicInfo');
    infoElement.innerHTML = `<b>Your Timelocked Tokens:</b> <span id="yourTokensText">${tokensLocked} BSOV</span>, <br><br><b>Unlock Date:</b> ${unlockTime}, <br><b>Slow-Release Withdrawal Rate:</b> ${withdrawRate} tokens/week`;
}


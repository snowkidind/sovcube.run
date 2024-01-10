// bsov-calls.js

let bsovTokenABI = null;

function loadBSOVTokenABI(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/dapp/bsov.abi', true); // Update the path to the correct URL
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            bsovTokenABI = JSON.parse(xhr.responseText);
            if (callback) {
                callback();
            }
        }
    };
    xhr.send();
}

// Call this function when your app starts, for example, after connecting to MetaMask
loadBSOVTokenABI();

// Function to timelock tokens
function timelockTokens(contractAddress, amount) {
    if (!bsovTokenABI) {
        console.error('BSOV Token ABI is not loaded');
        return;
    }

    const bsovTokenContract = new web3.eth.Contract(bsovTokenABI, tokenContractAddress);
    bsovTokenContract.methods.approveAndCall(contractAddress, amount, "0x").send({ from: selectedAccount })
    .then(function(receipt){
        console.log("Transaction receipt: ", receipt);
    }).catch(function(error){
        console.error("Error in transaction: ", error);
    });
}


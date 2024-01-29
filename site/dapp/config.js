
const contract1Address = '0xD7acf55092d7d25377b3b590Bf52F721DFf05f58'; // Replace with actual Contract 1 address
const contract2Address = '0x5e8A7CC22330475763A8C5e0cEDDF7Da7d10F377'; // Replace with actual Contract 2 address
const tokenContractAddress = '0x71882b39531992Bb18a3896D65Bae93A26932336';
const rewardsReserveContractAddress = '0x5cb12448576b69061ED35963AE45A29b6a712bb8';

console.log("config.js is starting...");

/*
let web3;
let selectedAccount;


// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
}
*/
// Sending an AJAX request to your PHP script
/*fetch('/stats/index.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `giveawayReserveContractAddress=${giveawayReserveContractAddress}`
})
.then(response => response.text())
.then(data => {
    // Handle the response data
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});
console.log("config.js is loaded...");
*/

fetch('/stats/index.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `rewardsReserveContractAddress=${rewardsReserveContractAddress}`
})
.then(response => response.text())
.then(data => {
    console.log("Response received");
})
.catch(error => {
    console.error('Error:', error);
});

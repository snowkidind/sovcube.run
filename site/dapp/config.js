
const contract1Address = '0x729c1ED996e852698D88129da0780749a9E6F707'; // Replace with actual Contract 1 address
const contract2Address = '0xa02AF0DdF188A5dC3495Da2eFDBD614Ae7A21018'; // Replace with actual Contract 2 address
const tokenContractAddress = '0x240E059d1B46159d74f103ab7dC63c0478DEE8Dc';
const giveawayReserveContractAddress = '0x782412935A7A4AfD222FB3693cb0eF0a3255FA78';
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
    body: `giveawayReserveContractAddress=${giveawayReserveContractAddress}`
})
.then(response => response.text())
.then(data => {
    console.log("Response received");
})
.catch(error => {
    console.error('Error:', error);
});

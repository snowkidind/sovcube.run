async function initiateWeb3() {
    if (window.ethereum) {
      // window.web3 = new Web3(window.ethereum);
        try {
           //  await window.ethereum.request({ method: 'eth_requestAccounts' });
	await checkWalletConnection();
		

//		console.log('Connected to: '+ selectedAccount);
		if (selectedAccount) {
//			console.log('2Connected to: '+ selectedAccount);
            fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi');
	    fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi');
            fetchTransactions(contract2Address, 'transactionTableBody2Incoming', '/dapp/contract2.abi');
		}


        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.error('Web3 not detected');
    }
}








async function loadContractAbi(abiPath) {
    try {
        const response = await fetch(abiPath);
        const abiJson = await response.json();
        return abiJson;
    } catch (error) {
        console.error('Error loading contract ABI:', error);
        throw error;
    }
}




async function fetchTransactions(contractAddress, tableId, abiPath) {
    const contractAbi = await loadContractAbi(abiPath);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    let allEvents = [];

    if (tableId === 'transactionTableBody2Incoming') {
        const tokensClaimedEvents = await contract.getPastEvents('TokensClaimed', { fromBlock: 0, toBlock: 'latest' });
        const sendTimelockedMarkedEvents = await contract.getPastEvents('sendTimelockedMarked', { fromBlock: 0, toBlock: 'latest' });
        allEvents = [...tokensClaimedEvents, ...sendTimelockedMarkedEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
		  //  console.log('AllEvents from transactionTableBody2Incoming: ', allEvents);
    } else {
        const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
        const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });
        allEvents = [...tokensUnfrozenEvents, ...tokensFrozenEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
// console.log('AllEvents from everything else: ', allEvents);
    }

    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';


for (const event of allEvents) {
    const sender = event.returnValues.addr || event.returnValues._sender || event.returnValues.from || event.returnValues.to;
    let senderFrom = event.returnValues.to || event.returnValues.from;
//	console.log('senderFrom: ', senderFrom);

    // Check if the sender matches the selected account OR
    // for events of type 'sendTimelockedMarked', check if senderFrom matches the selected account
    if (sender.toLowerCase() === selectedAccount.toLowerCase() || 
        (event.event == 'sendTimelockedMarked' && senderFrom.toLowerCase() === selectedAccount.toLowerCase())) {
//		console.log('Found sendTimelockedMarked');

	/*
    for (const event of allEvents) {
        const sender = event.returnValues.addr || event.returnValues._sender || event.returnValues.from || event.returnValues.to;
        const senderFrom = event.returnValues.from || event.returnValues.to;
        if ((sender.toLowerCase() === selectedAccount.toLowerCase()) || (event.event === 'sendTimelockedMarked' && senderFrom.toLowerCase() === selectedAccount.toLowerCase())) {
 */
		const row = tableBody.insertRow();
            const timestampCell = row.insertCell(0);
            const methodCell = row.insertCell(1);
            const amountCell = row.insertCell(2);

            const eventType = event.event;
// console.log('Event type:', eventType);
// console.log('Event:', event);

    
		if (eventType === 'TokensUnfrozen') {
                methodCell.textContent = 'Withdraw';
            } else if (eventType === 'TokensFrozen') {
                methodCell.textContent = 'Timelock';
            } else if (eventType === 'TokensClaimed') {
                methodCell.textContent = 'Accept Incoming Tokens';



	    } else if (eventType === 'sendTimelockedMarked') {
		   // console.log('found "sendTimelockedMarked"');
    const isSender = event.returnValues.from.toLowerCase() == selectedAccount.toLowerCase();
    const isRecipient = event.returnValues.to.toLowerCase() == selectedAccount.toLowerCase();
		   // console.log('isRecipient: ', isRecipient);
		   // console.log('isSender: ', isSender);
//		        console.log('Selected Account:', selectedAccount);
 //   console.log('From:', event.returnValues.from);
//    console.log('To:', event.returnValues.to);

//console.log('sender: ',sender);
//console.log('senderFrom: ',senderFrom);	    
	      if (isRecipient && isSender) {
        methodCell.textContent = 'Sent to Self';
     } else if (isRecipient) {
	   //  console.log('This account is a Recipient of a transaction!')
        methodCell.textContent = 'Incoming Tokens';
     } else if (isSender) {
        methodCell.textContent = 'Sent Locked Tokens';
    } else {
        methodCell.textContent = 'Unknown';
    }



	    } else {
                // If the event type is unknown, set a default value or handle it accordingly
                methodCell.textContent = 'ERROR';
            }

            const amountInWei = BigInt(event.returnValues.amount || event.returnValues.amt);
            const decimals = 8;
            const amountInToken = Number(amountInWei) / 10**decimals;

            amountCell.textContent = `${amountInToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} BSOV`;

            const block = await web3.eth.getBlock(event.blockNumber);
            const timestamp = new Date(Number(block.timestamp) * 1000);
            const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
            const formattedTimestamp = timestamp.toLocaleString('en-GB', options);

            timestampCell.textContent = formattedTimestamp;
            timestampCell.style.fontSize = '8pt';
        }
    }
}





initiateWeb3();

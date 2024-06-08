async function initiateWeb3() {
    if (window.ethereum) {
        try {
            await checkWalletConnection();
            if (selectedAccount) {
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
        try {
            const tokensClaimedEvents = await contract.getPastEvents('TokensClaimed', { fromBlock: 0, toBlock: 'latest' });
            const sendTimelockedMarkedEvents = await contract.getPastEvents('sendTimelockedMarked', { fromBlock: 0, toBlock: 'latest' });
            allEvents = [...tokensClaimedEvents, ...sendTimelockedMarkedEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        } catch (error) {
            console.error('Error fetching TokensClaimed or sendTimelockedMarked events:', error);
        }
    } else {
        try {
            const events1 = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
            const events2 = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });
            allEvents = [...events1, ...events2].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        } catch (error) {
            console.error('Error fetching TokensUnfrozen or TokensFrozen events:', error);
        }

        try {
            const events3 = await contract.getPastEvents('TokenWithdrawal', { fromBlock: 0, toBlock: 'latest' });
            const events4 = await contract.getPastEvents('TokenTimelock', { fromBlock: 0, toBlock: 'latest' });
            allEvents = [...allEvents, ...events3, ...events4].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        } catch (error) {
            console.error('Error fetching TokenWithdrawal or TokenTimelock events:', error);
        }
    }

    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';

    for (const event of allEvents) {
        const sender = event.returnValues.addr || event.returnValues._sender || event.returnValues.from || event.returnValues.to;
        let senderFrom = event.returnValues.to || event.returnValues.from;

        if (sender && selectedAccount && sender.toLowerCase() === selectedAccount.toLowerCase() ||
            (event.event === 'sendTimelockedMarked' && senderFrom && senderFrom.toLowerCase() === selectedAccount.toLowerCase())) {

            const row = tableBody.insertRow();
            const timestampCell = row.insertCell(0);
            const methodCell = row.insertCell(1);
            const amountCell = row.insertCell(2);

            const eventType = event.event;

            if (eventType === 'TokensUnfrozen' || eventType === 'TokenWithdrawal') {
                methodCell.textContent = 'Withdraw';
            } else if (eventType === 'TokensFrozen' || eventType === 'TokenTimelock') {
                methodCell.textContent = 'Timelock';
            } else if (eventType === 'TokensClaimed') {
                methodCell.textContent = 'Accept Incoming Tokens';
            } else if (eventType === 'sendTimelockedMarked') {
                const isSender = event.returnValues.from.toLowerCase() === selectedAccount.toLowerCase();
                const isRecipient = event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase();
                if (isRecipient && isSender) {
                    methodCell.textContent = 'Sent to Self';
                } else if (isRecipient) {
                    methodCell.textContent = 'Incoming Tokens';
                } else if (isSender) {
                    methodCell.textContent = 'Sent Locked Tokens';
                } else {
                    methodCell.textContent = 'Unknown';
                }
            } else {
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

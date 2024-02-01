            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // Now you can start your Web3.js interactions
                    fetchTransactions();
                } catch (error) {
                    console.error('User denied account access');
                }
            } else {
                console.error('Web3 not detected');
            }

        async function fetchTransactions() {
            const contractAddress = contract1Address;
            const contractAbi = '/dapp/contract2.abi'; // Replace with your contract ABI

            const contract = new web3.eth.Contract(contractAbi, contractAddress);

            // Fetch past events for TokensUnfrozen and TokensFrozen methods
            const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
            const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });

            // Combine and sort events by block timestamp
            const allEvents = [...tokensUnfrozenEvents, ...tokensFrozenEvents].sort((a, b) => a.blockNumber - b.blockNumber);

            // Populate the HTML table
            const tableBody = document.getElementById('transactionTableBody');
            allEvents.forEach(event => {
                const row = tableBody.insertRow();
                const addressCell = row.insertCell(0);
                const methodCell = row.insertCell(1);
                const amountCell = row.insertCell(2);

                addressCell.textContent = event.returnValues.addr; // Replace with the appropriate field
                methodCell.textContent = event.event === 'TokensUnfrozen' ? 'Withdraw' : 'Timelock'; // Replace with the appropriate field
                amountCell.textContent = `${web3.utils.fromWei(event.returnValues.amt)} BSOV`; // Replace with the appropriate field
            });
        }
    </script>

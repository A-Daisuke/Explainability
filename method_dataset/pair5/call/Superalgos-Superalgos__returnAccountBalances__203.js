            async function returnAccountBalances(web3) {

                let responseData = {}
                for (let i = 0; i < walletDefinition.walletAccounts.length; i++) {
                    let walletAccount = walletDefinition.walletAccounts[i]

                    if (walletAccount.ethBalance !== undefined) {
                        try {
                            walletAccount.ethBalance.value = await web3.eth.getBalance(walletAccount.config.address)
                        } catch (err) {
                            if (err.message.indexOf('Provided address') >= 0) {
                                walletAccount.error = 'Invalid configured address.'
                            } else {
                                walletAccount.error = err.message
                            }
                        }
                    }

                    for (let j = 0; j < walletAccount.tokenBalances.length; j++) {
                        let tokenBalance = walletAccount.tokenBalances[j]

                        if (tokenBalance.referenceParent === undefined) { continue }
                        if (tokenBalance.referenceParent.parentNode === undefined) { continue }
                        if (tokenBalance.referenceParent.smartContracts === undefined) { continue }

                        if (tokenBalance.referenceParent.config.codeName === undefined) {
                            tokenBalance.error = 'Reference Parent without config.codeName defined.'
                            continue
                        }

                        if (tokenBalance.referenceParent.smartContracts.config.address === undefined) {
                            tokenBalance.error = 'Reference Parent Smart Contract without config.address defined.'
                            continue
                        }

                        let tokenContractAddress = tokenBalance.referenceParent.smartContracts.config.address
                        // The minimum ABI to get ERC20 Token balance
                        let minABI = [
                            // balanceOf
                            {
                                "constant": true,
                                "inputs": [{ "name": "_owner", "type": "address" }],
                                "name": "balanceOf",
                                "outputs": [{ "name": "balance", "type": "uint256" }],
                                "type": "function"
                            },
                            // decimals
                            {
                                "constant": true,
                                "inputs": [],
                                "name": "decimals",
                                "outputs": [{ "name": "", "type": "uint8" }],
                                "type": "function"
                            }
                        ];

                        let contract = new web3.eth.Contract(minABI, tokenContractAddress);

                        try {
                            tokenBalance.value = await contract.methods.balanceOf(walletAccount.config.address).call()
                        } catch (err) {
                            if (err.message.indexOf('Provided address') >= 0) {
                                walletAccount.error = 'Invalid configured address.'
                            } else {
                                walletAccount.error = err.message
                            }
                        }
                    }
                }

                responseData.result = 'Ok'
                responseData.walletDefinition = walletDefinition
                return responseData
            }

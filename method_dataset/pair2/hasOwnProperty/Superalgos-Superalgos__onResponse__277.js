            function onResponse(err, data) {
                if (err.result === GLOBAL.DEFAULT_FAIL_RESPONSE) {
                    console.log((new Date()).toISOString(), '[WARN] Error fetching executed test cases from Bitcoin Factory Server')
                    return
                } else {
                    let response = JSON.parse(data)
                    if (response.result === 'Not Ok') {
                        console.log((new Date()).toISOString(), '[WARN] Error fetching executed test cases from Bitcoin Factory Server - ./Bitcoin-Factory/Reports/Testnet*.csv')
                        return
                    }

                    let executedTests = response.executedTests

                    for (let user in executedTests) {
                        if (executedTests.hasOwnProperty(user)) {
                            thisObject.executedTestCases.set(user, executedTests[user])
                        }
                    }
                }
            }

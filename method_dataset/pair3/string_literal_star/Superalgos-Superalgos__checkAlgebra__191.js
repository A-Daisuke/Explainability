        function checkAlgebra(logicOperand, comparisonOperand) {
            comparisonOperand.algebra = {
                operandA: { index: 0 },
                operandB: { index: 1 }
            }

            /* The default situation is that there is no algebra operation, meaning we will setup a algebra operation only with operandA */
            comparisonOperand.algebra.operandA.code = comparisonOperand.code
            comparisonOperand.algebra.operandB.code = ''
            comparisonOperand.algebra.operator = '...'
            comparisonOperand.algebra.operatorIndex = 0

            if (comparisonOperand.code.indexOf('+') > 0) {
                let codeArray = comparisonOperand.code.split('+')
                comparisonOperand.algebra.operandA.code = codeArray[0]
                comparisonOperand.algebra.operandB.code = codeArray[1]
                comparisonOperand.algebra.operator = '+'
                comparisonOperand.algebra.operatorIndex = 1
            }

            if (comparisonOperand.code.indexOf('-') > 0) {
                let codeArray = comparisonOperand.code.split('-')
                comparisonOperand.algebra.operandA.code = codeArray[0]
                comparisonOperand.algebra.operandB.code = codeArray[1]
                comparisonOperand.algebra.operator = '-'
                comparisonOperand.algebra.operatorIndex = 2
            }

            if (comparisonOperand.code.indexOf('*') > 0) {
                let codeArray = comparisonOperand.code.split('*')
                comparisonOperand.algebra.operandA.code = codeArray[0]
                comparisonOperand.algebra.operandB.code = codeArray[1]
                comparisonOperand.algebra.operator = '*'
                comparisonOperand.algebra.operatorIndex = 3
            }

            if (comparisonOperand.code.indexOf('/') > 0) {
                let codeArray = comparisonOperand.code.split('/')
                comparisonOperand.algebra.operandA.code = codeArray[0]
                comparisonOperand.algebra.operandB.code = codeArray[1]
                comparisonOperand.algebra.operator = '/'
                comparisonOperand.algebra.operatorIndex = 4
            }

            initializePickersSet(logicOperand, comparisonOperand, comparisonOperand.algebra.operandA)
            initializePickersSet(logicOperand, comparisonOperand, comparisonOperand.algebra.operandB)
            updatePickers(logicOperand, comparisonOperand, comparisonOperand.algebra.operandA)
            updatePickers(logicOperand, comparisonOperand, comparisonOperand.algebra.operandB)
        }

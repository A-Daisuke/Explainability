  function performOperation(operator) {
    const rightOp = stack.pop() // Right operand is the top of the stack
    const leftOp = stack.pop() // Left operand is the next item on the stack

    if (leftOp === undefined || rightOp === undefined) {
      return false // Invalid expression
    }
    switch (operator) {
      case '+':
        stack.push(leftOp + rightOp)
        break
      case '-':
        stack.push(leftOp - rightOp)
        break
      case '*':
        stack.push(leftOp * rightOp)
        break
      case '/':
        if (rightOp === 0) {
          return false
        }
        stack.push(leftOp / rightOp)
        break
      default:
        return false // Unknown operator
    }
    return true
  }

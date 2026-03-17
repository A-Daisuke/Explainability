class __C__ {
  evaluateBinaryExpression(node, environment) {
    const left = this.evaluate(node.left, environment);
    switch (node.operator.value) {
      case "and":
        return left.__bool__().value ? this.evaluate(node.right, environment) : left;
      case "or":
        return left.__bool__().value ? left : this.evaluate(node.right, environment);
    }
    const right = this.evaluate(node.right, environment);
    switch (node.operator.value) {
      case "==":
        return new BooleanValue(left.value == right.value);
      case "!=":
        return new BooleanValue(left.value != right.value);
    }
    if (left instanceof UndefinedValue || right instanceof UndefinedValue) {
      throw new Error("Cannot perform operation on undefined values");
    } else if (left instanceof NullValue || right instanceof NullValue) {
      throw new Error("Cannot perform operation on null values");
    } else if (left instanceof NumericValue && right instanceof NumericValue) {
      switch (node.operator.value) {
        case "+":
          return new NumericValue(left.value + right.value);
        case "-":
          return new NumericValue(left.value - right.value);
        case "*":
          return new NumericValue(left.value * right.value);
        case "/":
          return new NumericValue(left.value / right.value);
        case "%":
          return new NumericValue(left.value % right.value);
        case "<":
          return new BooleanValue(left.value < right.value);
        case ">":
          return new BooleanValue(left.value > right.value);
        case ">=":
          return new BooleanValue(left.value >= right.value);
        case "<=":
          return new BooleanValue(left.value <= right.value);
      }
    } else if (left instanceof ArrayValue && right instanceof ArrayValue) {
      switch (node.operator.value) {
        case "+":
          return new ArrayValue(left.value.concat(right.value));
      }
    } else if (right instanceof ArrayValue) {
      const member = right.value.find((x) => x.value === left.value) !== void 0;
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(member);
        case "not in":
          return new BooleanValue(!member);
      }
    }
    if (left instanceof StringValue || right instanceof StringValue) {
      switch (node.operator.value) {
        case "+":
          return new StringValue(left.value.toString() + right.value.toString());
      }
    }
    if (left instanceof StringValue && right instanceof StringValue) {
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(right.value.includes(left.value));
        case "not in":
          return new BooleanValue(!right.value.includes(left.value));
      }
    }
    if (left instanceof StringValue && right instanceof ObjectValue) {
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(right.value.has(left.value));
        case "not in":
          return new BooleanValue(!right.value.has(left.value));
      }
    }
    throw new SyntaxError(`Unknown operator "${node.operator.value}" between ${left.type} and ${right.type}`);
  }

}

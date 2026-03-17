function evaluateExpression(expression, context) {
    /**
     * @type {import("./operators").ConditionOperator|null}
     */
    const operator = operatorMap.get(expression.operator) || null;
    if (operator === null) {
        throw new Error("Unexpected expression operator ID '" + expression.operator + "'. Expected one of [" + operatorMap.keys().join(",") + "]");
    }

    if (!Object.prototype.hasOwnProperty.call(context, expression.variable)) {
        throw new Error("Variable missing in context: " + expression.variable);
    }

    return operator.test(context[expression.variable], expression.value);
}

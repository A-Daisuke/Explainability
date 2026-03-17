function __method_wrapper__() {
	return function (node, context) {
		if (!(node.type === 'BinaryExpression' && node.operator === '*')) {
			return;
		}

		let mathLogCall;
		let description;
		if (isMathMethodCall(node.left, 'log') && isMathProperty(node.right, constantName)) {
			mathLogCall = node.left;
			description = `Math.log(…) * Math.${constantName}`;
		} else if (isMathMethodCall(node.right, 'log') && isMathProperty(node.left, constantName)) {
			mathLogCall = node.right;
			description = `Math.${constantName} * Math.log(…)`;
		}

		if (!mathLogCall) {
			return;
		}

		const [valueNode] = mathLogCall.arguments;

		return {
			node,
			messageId: MESSAGE_ID,
			data: {
				replacement,
				description,
			},
			fix: fixer => fixer.replaceText(node, `Math.${replacementMethod}(${getParenthesizedText(valueNode, context.sourceCode)})`),
		};
	};

}

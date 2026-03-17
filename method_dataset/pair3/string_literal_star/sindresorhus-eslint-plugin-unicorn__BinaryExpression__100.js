	* BinaryExpression(binaryExpression) {
		if (
			binaryExpression.operator !== '-'
			&& binaryExpression.operator !== '*'
			&& binaryExpression.operator !== '/'
			&& binaryExpression.operator !== '%'
			&& binaryExpression.operator !== '**'
		) {
			return;
		}

		for (const node of [binaryExpression.left, binaryExpression.right]) {
			if (isNewDate(node)) {
				yield getProblem(node);
			}
		}
	},

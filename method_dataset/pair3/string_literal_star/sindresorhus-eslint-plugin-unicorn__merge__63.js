	function merge(options, mergeOptions) {
		const {
			before = '',
			after = ';',
			consequent,
			alternate,
			node,
		} = options;

		const {
			checkThrowStatement,
			returnFalseIfNotMergeable,
		} = {
			checkThrowStatement: false,
			returnFalseIfNotMergeable: false,
			...mergeOptions,
		};

		if (!consequent || !alternate || consequent.type !== alternate.type) {
			return returnFalseIfNotMergeable ? false : options;
		}

		const {type, argument, delegate, left, right, operator} = consequent;

		if (
			type === 'ReturnStatement'
			&& !isTernary(argument)
			&& !isTernary(alternate.argument)
		) {
			return merge({
				before: `${before}return `,
				after,
				consequent: argument === null ? 'undefined' : argument,
				alternate: alternate.argument === null ? 'undefined' : alternate.argument,
				node,
			});
		}

		if (
			type === 'YieldExpression'
			&& delegate === alternate.delegate
			&& !isTernary(argument)
			&& !isTernary(alternate.argument)
		) {
			return merge({
				before: `${before}yield${delegate ? '*' : ''} (`,
				after: `)${after}`,
				consequent: argument === null ? 'undefined' : argument,
				alternate: alternate.argument === null ? 'undefined' : alternate.argument,
				node,
			});
		}

		if (
			type === 'AwaitExpression'
			&& !isTernary(argument)
			&& !isTernary(alternate.argument)
		) {
			return merge({
				before: `${before}await (`,
				after: `)${after}`,
				consequent: argument,
				alternate: alternate.argument,
				node,
			});
		}

		if (
			checkThrowStatement
			&& type === 'ThrowStatement'
			&& !isTernary(argument)
			&& !isTernary(alternate.argument)
		) {
			// `ThrowStatement` don't check nested

			// If `IfStatement` is not a `BlockStatement`, need add `{}`
			const {parent} = node;
			const needBraces = parent && parent.type !== 'BlockStatement';
			return {
				type,
				before: `${before}${needBraces ? '{\n{{INDENT_STRING}}' : ''}const {{ERROR_NAME}} = `,
				after: `;\n{{INDENT_STRING}}throw {{ERROR_NAME}};${needBraces ? '\n}' : ''}`,
				consequent: argument,
				alternate: alternate.argument,
			};
		}

		if (
			type === 'AssignmentExpression'
			&& operator === alternate.operator
			&& !isTernary(left)
			&& !isTernary(alternate.left)
			&& !isTernary(right)
			&& !isTernary(alternate.right)
			&& isSameReference(left, alternate.left)
		) {
			return merge({
				before: `${before}${sourceCode.getText(left)} ${operator} `,
				after,
				consequent: right,
				alternate: alternate.right,
				node,
			});
		}

		return returnFalseIfNotMergeable ? false : options;
	}

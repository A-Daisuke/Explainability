const isRegExpWithoutGlobalFlag = (node, scope) => {
	if (isRegexLiteral(node)) {
		return !node.regex.flags.includes('g');
	}

	const staticResult = getStaticValue(node, scope);

	// Don't know if there is `g` flag
	if (!staticResult) {
		return false;
	}

	const {value} = staticResult;
	return (
		Object.prototype.toString.call(value) === '[object RegExp]'
		&& !value.global
	);
};

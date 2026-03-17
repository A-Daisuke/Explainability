function getImported(variable, sourceCode) {
	const specifier = variable.defs[0].node;
	const result = {
		node: specifier,
		declaration: specifier.parent,
		variable,
		isTypeImport: isTypeImport(specifier),
	};

	switch (specifier.type) {
		case 'ImportDefaultSpecifier': {
			return {
				name: DEFAULT_SPECIFIER_NAME,
				text: 'default',
				...result,
			};
		}

		case 'ImportSpecifier': {
			return {
				name: getSpecifierName(specifier.imported),
				text: sourceCode.getText(specifier.imported),
				...result,
			};
		}

		case 'ImportNamespaceSpecifier': {
			return {
				name: NAMESPACE_SPECIFIER_NAME,
				text: '*',
				...result,
			};
		}

		// No default
	}
}

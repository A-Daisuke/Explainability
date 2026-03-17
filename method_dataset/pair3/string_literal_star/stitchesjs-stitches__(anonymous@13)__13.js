function __method_wrapper__() {
	($0, direction, multiplier, separator, token) => (
		separator == "$" == !!multiplier
			? $0
		: (
			direction || separator == '--'
				? 'calc('
			: ''
		) + (
			'var(--' + (
				separator === '$'
					? toTailDashed(prefix) + (
						!token.includes('$')
							? toTailDashed(scale)
						: ''
					) + token.replace(/\$/g, '-')
				: token
			) + ')' + (
				direction || separator == '--'
					? '*' + (
						direction || ''
					) + (
						multiplier || '1'
					) + ')'
				: ''
			)
		)
	),

}

	const toString = () => {
		const { cssRules } = groupSheet.sheet
		return [].map
			.call(cssRules, (cssRule, cssRuleIndex) => {
				const { cssText } = cssRule

				let lastRuleCssText = ''

				if (cssText.startsWith('--sxs')) return ''

				if (cssRules[cssRuleIndex - 1] && (lastRuleCssText = cssRules[cssRuleIndex - 1].cssText).startsWith('--sxs')) {
					if (!cssRule.cssRules.length) return ''

					for (const name in groupSheet.rules) {
						if (groupSheet.rules[name].group === cssRule) {
							return `--sxs{--sxs:${[...groupSheet.rules[name].cache].join(' ')}}${cssText}`
						}
					}

					return cssRule.cssRules.length ? `${lastRuleCssText}${cssText}` : ''
				}

				return cssText
			})
			.join('')
	}

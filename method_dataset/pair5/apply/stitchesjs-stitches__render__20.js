		const render = () => {
			if (!sheet.rules.global.cache.has(name)) {
				sheet.rules.global.cache.add(name)

				const cssRules = []

				toCssRules(style, [], [], config, (cssText) => cssRules.push(cssText))

				const cssText = `@keyframes ${name}{${cssRules.join('')}}`

				sheet.rules.global.apply(cssText)
			}

			return name
		}

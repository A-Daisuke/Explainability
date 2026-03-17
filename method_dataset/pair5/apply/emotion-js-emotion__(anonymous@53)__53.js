      let Styled = React.forwardRef<unknown, StyledProps>((props, ref) => {
        const finalTag =
          (shouldUseAs && (props.as as React.ElementType)) || component

        let mergedProps = props
        if (props.theme == null) {
          mergedProps = {}
          for (let key in props) {
            mergedProps[key] = props[key]
          }
          mergedProps.theme = React.useContext(ThemeContext)
        }

        let finalShouldForwardProp =
          shouldUseAs && shouldForwardProp === undefined
            ? getShouldForwardProp(finalTag)
            : defaultShouldForwardProp

        let newProps: Record<string, unknown> = {}

        for (let key in props) {
          if (shouldUseAs && key === 'as') continue

          if (finalShouldForwardProp(key)) {
            newProps[key] = props[key]
          }
        }
        newProps.style = [css.apply(mergedProps, styles), props.style]
        if (ref) {
          newProps.ref = ref
        }

        return React.createElement(finalTag, newProps)
      })

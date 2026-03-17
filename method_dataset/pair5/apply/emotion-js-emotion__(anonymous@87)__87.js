function __method_wrapper__() {
  return function () {
    // eslint-disable-next-line prefer-rest-params
    let args = arguments as any as Array<
      TemplateStringsArray | Interpolation<Theme>
    >
    let styles =
      isReal && tag.__emotion_styles !== undefined
        ? tag.__emotion_styles.slice(0)
        : []

    if (identifierName !== undefined) {
      styles.push(`label:${identifierName};`)
    }
    if (
      args[0] == null ||
      (args[0] as TemplateStringsArray).raw === undefined
    ) {
      // eslint-disable-next-line prefer-spread
      styles.push.apply(styles, args)
    } else {
      const templateStringsArr = args[0] as TemplateStringsArray
      if (isDevelopment && templateStringsArr[0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
      }
      styles.push(templateStringsArr[0])
      let len = args.length
      let i = 1
      for (; i < len; i++) {
        if (isDevelopment && templateStringsArr[i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
        }
        styles.push(args[i], templateStringsArr[i])
      }
    }

    const Styled: ElementType = withEmotionCache(
      (props: Record<string, unknown>, cache, ref) => {
        const FinalTag =
          (shouldUseAs && (props.as as React.ElementType)) || baseTag

        let className = ''
        let classInterpolations: Interpolation<Theme>[] = []
        let mergedProps = props
        if (props.theme == null) {
          mergedProps = {}
          for (let key in props) {
            mergedProps[key] = props[key]
          }
          mergedProps.theme = React.useContext(ThemeContext)
        }

        if (typeof props.className === 'string') {
          className = getRegisteredStyles(
            cache.registered,
            classInterpolations,
            props.className
          )
        } else if (props.className != null) {
          className = `${props.className} `
        }

        const serialized = serializeStyles(
          styles.concat(classInterpolations),
          cache.registered,
          mergedProps
        )
        className += `${cache.key}-${serialized.name}`
        if (targetClassName !== undefined) {
          className += ` ${targetClassName}`
        }

        const finalShouldForwardProp =
          shouldUseAs && shouldForwardProp === undefined
            ? getDefaultShouldForwardProp(FinalTag)
            : defaultShouldForwardProp

        let newProps: Record<string, unknown> = {}

        for (let key in props) {
          if (shouldUseAs && key === 'as') continue

          if (finalShouldForwardProp(key)) {
            newProps[key] = props[key]
          }
        }
        newProps.className = className
        if (ref) {
          newProps.ref = ref
        }

        return (
          <>
            <Insertion
              cache={cache}
              serialized={serialized}
              isStringTag={typeof FinalTag === 'string'}
            />
            <FinalTag {...newProps} />
          </>
        )
      }
    )

    Styled.displayName =
      identifierName !== undefined
        ? identifierName
        : `Styled(${
            typeof baseTag === 'string'
              ? baseTag
              : baseTag.displayName || baseTag.name || 'Component'
          })`

    Styled.defaultProps = tag.defaultProps
    Styled.__emotion_real = Styled
    Styled.__emotion_base = baseTag
    Styled.__emotion_styles = styles
    Styled.__emotion_forwardProp = shouldForwardProp

    Object.defineProperty(Styled, 'toString', {
      value() {
        if (targetClassName === undefined && isDevelopment) {
          return 'NO_COMPONENT_SELECTOR'
        }
        return `.${targetClassName}`
      }
    })
    ;(Styled as any).withComponent = (
      nextTag: ElementType,
      nextOptions: StyledOptions
    ) => {
      const newStyled = createStyled(nextTag, {
        ...options,
        ...nextOptions,
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      })
      return (newStyled as any)(...styles)
    }

    return Styled
  }

}

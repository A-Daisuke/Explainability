function __method_wrapper__() {
  (props, cache, ref) => {
    let cssProp = props.css as EmotionProps['css']

    // so that using `css` from `emotion` and passing the result to the css prop works
    // not passing the registered cache to serializeStyles because it would
    // make certain babel optimisations not possible
    if (
      typeof cssProp === 'string' &&
      cache.registered[cssProp] !== undefined
    ) {
      cssProp = cache.registered[cssProp]
    }

    let WrappedComponent = props[
      typePropName
    ] as EmotionProps[typeof typePropName]
    let registeredStyles = [cssProp]
    let className = ''

    if (typeof props.className === 'string') {
      className = getRegisteredStyles(
        cache.registered,
        registeredStyles,
        props.className
      )
    } else if (props.className != null) {
      className = `${props.className} `
    }

    let serialized = serializeStyles(
      registeredStyles,
      undefined,
      React.useContext(ThemeContext)
    )

    if (isDevelopment && serialized.name.indexOf('-') === -1) {
      let labelFromStack = props[labelPropName]
      if (labelFromStack) {
        serialized = serializeStyles([
          serialized,
          'label:' + labelFromStack + ';'
        ])
      }
    }

    className += `${cache.key}-${serialized.name}`

    const newProps: Record<string, unknown> = {}
    for (let key in props) {
      if (
        hasOwn.call(props, key) &&
        key !== 'css' &&
        key !== typePropName &&
        (!isDevelopment || key !== labelPropName)
      ) {
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
          isStringTag={typeof WrappedComponent === 'string'}
        />
        <WrappedComponent {...newProps} />
      </>
    )
  }

}

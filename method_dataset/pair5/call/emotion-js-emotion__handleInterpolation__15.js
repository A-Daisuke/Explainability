function handleInterpolation(
  this: unknown,
  interpolation: any,
  i: number,
  arr: any[]
) {
  let type = typeof interpolation

  if (type === 'string') {
    // strip comments
    interpolation = interpolation.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
  }

  if (type === 'function') {
    if (this === undefined) {
      if (isDevelopment) {
        console.error(
          'Interpolating functions in css calls is not allowed.\n' +
            'If you want to have a css call based on props, create a function that returns a css call like this\n' +
            'let dynamicStyle = (props) => css`color: ${props.color}`\n' +
            'It can be called directly with props or interpolated in a styled call like this\n' +
            'let SomeComponent = styled.View`${dynamicStyle}`'
        )
      }
    } else {
      handleInterpolation.call(this, interpolation(this), i, arr)
    }
    return
  }
  let isIrrelevant = interpolation == null || type === 'boolean'
  let isRnStyle =
    (type === 'object' && !Array.isArray(interpolation)) || type === 'number'
  if (lastType === 'string' && (isRnStyle || isIrrelevant)) {
    let converted = convertStyles(buffer)
    if (converted !== undefined) {
      styles!.push(converted)
    }
    buffer = ''
  }
  if (isIrrelevant) {
    return
  }

  if (type === 'string') {
    buffer += interpolation

    if (arr.length - 1 === i) {
      let converted = convertStyles(buffer)
      if (converted !== undefined) {
        styles!.push(converted)
      }
      buffer = ''
    }
  }
  if (isRnStyle) {
    styles!.push(interpolation)
  }
  if (Array.isArray(interpolation)) {
    interpolation.forEach(handleInterpolation, this)
  }
  lastType = type
}

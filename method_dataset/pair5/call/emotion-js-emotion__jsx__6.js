export const jsx: typeof React.createElement = function (
  type: any,
  props: any
): any {
  // eslint-disable-next-line prefer-rest-params
  let args: any = arguments

  if (props == null || !hasOwn.call(props, 'css')) {
    return React.createElement.apply(undefined, args)
  }

  let argsLength = args.length
  let createElementArgArray: any = new Array(argsLength)
  createElementArgArray[0] = Emotion
  createElementArgArray[1] = createEmotionProps(type, props)

  for (let i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i]
  }

  return React.createElement.apply(null, createElementArgArray)
}

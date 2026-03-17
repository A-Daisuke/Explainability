export const createEmotionProps = (
  type: React.ElementType,
  props: { css: Interpolation<Theme> }
): EmotionProps => {
  if (
    isDevelopment &&
    typeof props.css === 'string' &&
    // check if there is a css declaration
    props.css.indexOf(':') !== -1
  ) {
    throw new Error(
      `Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css\`${props.css}\``
    )
  }

  let newProps = {} as EmotionProps

  for (let key in props) {
    if (hasOwn.call(props, key)) {
      newProps[key] = props[key as keyof typeof props]
    }
  }

  newProps[typePropName] = type

  // Runtime labeling is an opt-in feature because:
  // - It causes hydration warnings when using Safari and SSR
  // - It can degrade performance if there are a huge number of elements
  //
  // Even if the flag is set, we still don't compute the label if it has already
  // been determined by the Babel plugin.
  if (
    isDevelopment &&
    typeof globalThis !== 'undefined' &&
    !!(globalThis as any).EMOTION_RUNTIME_AUTO_LABEL &&
    !!props.css &&
    (typeof props.css !== 'object' ||
      !('name' in props.css) ||
      typeof props.css.name !== 'string' ||
      props.css.name.indexOf('-') === -1)
  ) {
    const label = getLabelFromStackTrace(new Error().stack)
    if (label) newProps[labelPropName] = label
  }

  return newProps
}

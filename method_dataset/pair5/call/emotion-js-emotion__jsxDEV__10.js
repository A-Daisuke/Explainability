export const jsxDEV: typeof ReactJSXRuntimeDev.jsxDEV = (
  type,
  props,
  key,
  isStaticChildren,
  source,
  self
) => {
  if (!hasOwn.call(props, 'css')) {
    return ReactJSXRuntimeDev.jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      source,
      self
    )
  }

  return ReactJSXRuntimeDev.jsxDEV(
    Emotion,
    createEmotionProps(type, props as { css: Interpolation<Theme> }),
    key,
    isStaticChildren,
    source,
    self
  )
}

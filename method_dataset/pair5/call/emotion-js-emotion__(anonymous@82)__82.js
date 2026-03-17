let ExperimentTriangle = createTriangle(({ x, y, size, color, ...props }) => {
  let className = ''
  const serialized = css`
    position: absolute;
    cursor: pointer;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-top-width: 0;
    transform: translate(50%, 50%);
    margin-left: ${x + 'px'};
    margin-top: ${y + 'px'};
    border-right-width: ${size / 2 + 'px'};
    border-bottom-width: ${size / 2 + 'px'};
    border-left-width: ${size / 2 + 'px'};
    border-bottom-color: ${color};
  `

  const cache = useContext(CacheContext)
  const rules = insertStyles(cache, serialized, true)
  className += `${cache.key}-${serialized.name}`

  const newProps = {}
  for (let key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key]
    }
  }

  newProps.className = className

  const ele = React.createElement('div', newProps)
  let serializedNames = serialized.name
  let next = serialized.next
  while (next !== undefined) {
    serializedNames += ' ' + next.name
    next = next.next
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('style', {
      [`data-emotion-${cache.key}`]: serializedNames,
      dangerouslySetInnerHTML: { __html: rules },
      nonce: cache.sheet.nonce,
      key: 1
    }),
    ele
  )
})

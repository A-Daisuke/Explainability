export const sanitizeNode: sanitizeNode = (
  data,
  isNode = true,
  path = new Set()
) => {
  const isPlainObject = _.isPlainObject(data)
  const isArray = _.isArray(data)

  if (isPlainObject || isArray) {
    if (path.has(data)) return data
    path.add(data)

    const returnData = isPlainObject
      ? ({} as IGatsbyNode)
      : ([] as Array<IGatsbyNode>)
    let anyFieldChanged = false

    // _.each is a "Collection" method and thus objects with "length" property are iterated as arrays
    const hasLengthProperty = isPlainObject
      ? Object.prototype.hasOwnProperty.call(data, `length`)
      : false
    let lengthProperty
    if (hasLengthProperty) {
      lengthProperty = (data as IGatsbyNode).length
      delete (data as IGatsbyNode).length
    }

    _.each(data, (value, key) => {
      if (isNode && key === `internal`) {
        returnData[key] = value
        return
      }
      returnData[key] = sanitizeNode(value as Data, false, path)

      if (returnData[key] !== value) {
        anyFieldChanged = true
      }
    })

    if (hasLengthProperty) {
      ;(data as IGatsbyNode).length = lengthProperty
      returnData.length = sanitizeNode(lengthProperty as Data, false, path)
      if (returnData.length !== lengthProperty) {
        anyFieldChanged = true
      }
    }

    if (anyFieldChanged) {
      data = omitUndefined(returnData as Data) as Data
    }

    // arrays and plain objects are supported - no need to to sanitize
    return data
  }

  if (!isTypeSupported(data)) {
    return undefined
  } else {
    return data
  }
}

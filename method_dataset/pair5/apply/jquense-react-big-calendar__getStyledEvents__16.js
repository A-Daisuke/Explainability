export function getStyledEvents({
  events,
  minimumStartDifference,
  slotMetrics,
  accessors,
  dayLayoutAlgorithm, // one of DefaultAlgorithms keys
  // or custom function
}) {
  let algorithm = dayLayoutAlgorithm

  if (dayLayoutAlgorithm in DefaultAlgorithms)
    algorithm = DefaultAlgorithms[dayLayoutAlgorithm]

  if (!isFunction(algorithm)) {
    // invalid algorithm
    return []
  }

  return algorithm.apply(this, arguments)
}

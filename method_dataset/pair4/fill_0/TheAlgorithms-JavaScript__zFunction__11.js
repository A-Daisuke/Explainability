function zFunction(text) {
  const length = text.length
  const zArray = Array(length).fill(0)
  // Initializing left and right variable to zero
  let left = 0
  let right = 0
  for (let index = 0; index < length; index++) {
    // If index is less than or equal to right, we reuse the values of zFunction at index right-index+1
    // It is made sure that value of zFunction at index is not greater than maximum possible value at index
    if (index <= right) {
      zArray[index] = Math.min(right - index + 1, zArray[index - left])
    }

    // After zArray[index] is initialized, we see if we can increase its value by trivially comparing character by character
    while (
      index + zArray[index] < length &&
      text[zArray[index]] === text[index + zArray[index]]
    ) {
      zArray[index]++
    }

    // If index + zArray[index] - 1 is greater than right, we update values of variables left and right
    if (index + zArray[index] - 1 > right) {
      left = index
      right = index + zArray[index] - 1
    }
  }
  return zArray
}

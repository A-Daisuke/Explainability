function isomorphicDecode (input) {
  // 1. To isomorphic decode a byte sequence input, return a string whose code point
  //    length is equal to input’s length and whose code points have the same values
  //    as the values of input’s bytes, in the same order.
  const length = input.length
  if ((2 << 15) - 1 > length) {
    return String.fromCharCode.apply(null, input)
  }
  let result = ''
  let i = 0
  let addition = (2 << 15) - 1
  while (i < length) {
    if (i + addition > length) {
      addition = length - i
    }
    result += String.fromCharCode.apply(null, input.subarray(i, i += addition))
  }
  return result
}

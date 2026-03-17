export function shallowEqual(
  a: $Shape<{|+[string]: mixed|}>,
  b: $Shape<{|+[string]: mixed|}>,
): boolean {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (let [key, value] of Object.entries(a)) {
    if (!b.hasOwnProperty(key) || b[key] !== value) {
      return false;
    }
  }

  return true;
}

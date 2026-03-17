export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  // Create a deep clone of the target to avoid mutation
  const result = deepClone(target);

  if (!sources.length) return result;

  const source = sources.shift();
  if (!source) return result;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const resultValue = result[key];

      if (isObject(resultValue) && isObject(sourceValue)) {
        result[key] = deepMerge(
          resultValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>,
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return deepMerge(result, ...sources);
}

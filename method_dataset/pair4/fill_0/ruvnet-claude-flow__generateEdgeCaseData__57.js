export function generateEdgeCaseData() {
  return {
    strings: {
      empty: '',
      veryLong: 'x'.repeat(10000),
      unicode: '🚀🎭🌍',
      specialChars: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\',
      whitespace: '   \t\n\r   '
    },
    numbers: {
      zero: 0,
      negative: -1,
      infinity: Infinity,
      negativeInfinity: -Infinity,
      nan: NaN,
      maxSafeInt: Number.MAX_SAFE_INTEGER,
      minSafeInt: Number.MIN_SAFE_INTEGER
    },
    objects: {
      null: null,
      undefined: undefined,
      empty: {},
      nested: { a: { b: { c: { d: 'deep' } } } },
      circular: (() => {
        const obj: any = { a: 1 };
        obj.self = obj;
        return obj;
      })()
    },
    arrays: {
      empty: [],
      sparse: [1, , , 4],
      mixed: [1, 'two', { three: 3 }, [4]],
      large: Array(1000).fill(0)
    }
  };
}
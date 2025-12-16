const Benchmark = {
    run: function() {
    const VAR_1 = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      KEY_1: 10,
    };
    VAR_1[Symbol.FUNCTION_1] = function* () {
      for (const VAR_2 in VAR_1) {
        if (VAR_2 !== "length") yield VAR_1[VAR_2];
      }
    };
    const VAR_3 = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const VAR_4 = new Map([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
      [8, 8],
      [9, 9],
    ]);
    Array.from(VAR_4);
    }
};

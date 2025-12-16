const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      return VAR_1.reduce((VAR_2, VAR_3) => [...VAR_2, ...VAR_3], []);
    }
    function FUNCTION_2(VAR_4) {
      return VAR_1.reduce((VAR_5, VAR_6) => VAR_2.concat(VAR_6), []);
    }
    function FUNCTION_3(VAR_7) {
      let VAR_8 = [];
      for (const VAR_9 of VAR_7) VAR_8 = [...VAR_8, ...VAR_9];
      return VAR_8;
    }
    const VAR_10 = [[], [1, 23], [1, 41, 42]];
    FUNCTION_1(VAR_10);
    }
};

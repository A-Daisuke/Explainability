const Benchmark = {
    run: function() {
    let VAR_1 = 1000;
    function FUNCTION_1(VAR_2) {
      let VAR_3 = Array(VAR_2);
      for (let VAR_4 = 0; VAR_4 < VAR_2; ++VAR_4) {
        VAR_3[VAR_5] = VAR_4;
      }
      return VAR_3;
    }
    function FUNCTION_2(VAR_6) {
      return Array(VAR_6).fill(0);
    }
    FUNCTION_2(VAR_1);
    }
};

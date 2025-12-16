const Benchmark = {
    run: function() {
    const VAR_1 = 150;
    const VAR_2 = VAR_1 - 1;
    function FUNCTION_1(VAR_3) {
      var VAR_4 = Array(VAR_3);
      for (var VAR_5 = 0; VAR_5 < VAR_3; ++VAR_5) VAR_4[VAR_6] = undefined;
      return VAR_4;
    }
    function FUNCTION_2(VAR_7) {
      var VAR_8 = [];
      for (var VAR_9 = 0; VAR_9 < VAR_7; ++VAR_9) VAR_4.push();
      return VAR_8;
    }
    function FUNCTION_3(VAR_10) {
      var VAR_11 = [];
      for (var VAR_12 = 0; VAR_12 < VAR_10; ++VAR_12) VAR_4[VAR_13] = undefined;
      return VAR_11;
    }
    Array.apply(null, Array(VAR_1));
    }
};

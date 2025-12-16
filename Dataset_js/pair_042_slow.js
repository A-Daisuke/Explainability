const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
      return VAR_1 * 64 + VAR_2 * 8 + VAR_3;
    }
    var VAR_4 = 0,
      VAR_5,
      VAR_6,
      VAR_7;
    for (VAR_5 = 0; VAR_5 < 2; VAR_5++) {
      for (VAR_6 = 0; VAR_6 < 2; VAR_6++) {
        for (VAR_7 = 0; VAR_7 < 2; VAR_7++) {
          VAR_4 += FUNCTION_1(VAR_5, VAR_6, VAR_7);
        }
      }
    }
    if (VAR_4 !== 292) throw "wrong count: " + VAR_4;
    }
};

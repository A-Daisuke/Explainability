const Benchmark = {
    run: function() {
    var VAR_1 = 3;
    var VAR_2 = Array.apply(null, new Array(1000)).map(function (VAR_3, VAR_4) {
      return VAR_4 + 1;
    });
    var VAR_5 = FUNCTION_1.bind(null, VAR_1);
    VAR_2.forEach(VAR_5);
    function FUNCTION_1(VAR_6, VAR_7) {
      var VAR_8 = 1;
      while (VAR_7 > 0) {
        VAR_8 *= VAR_6;
        VAR_7 -= 1;
      }
      return VAR_8;
    }
    }
};

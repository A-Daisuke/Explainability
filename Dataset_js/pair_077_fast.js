const Benchmark = {
    run: function() {
    var VAR_1 = 200,
      VAR_2 = VAR_1;
    var VAR_3 = [];
    while (VAR_2--) {
      VAR_3.push(0);
    }
    FUNCTION_1(100);
    function FUNCTION_1(VAR_4) {
      var VAR_5 = [];
      while (VAR_4--) {
        VAR_5.push(0);
      }
      return VAR_5;
    }
    }
};

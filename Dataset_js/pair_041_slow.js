const Benchmark = {
    run: function() {
    var VAR_1 = 0.05,
      VAR_2 = 0.5,
      VAR_3 = 5,
      VAR_4 = 15,
      VAR_5 = 150,
      VAR_6 = 1500,
      VAR_7 = 15000;
    function FUNCTION_1(VAR_8) {
      return Math.pow(10, Math.floor(Math.log(VAR_8) / Math.LN10));
    }
    FUNCTION_1(VAR_1);
    FUNCTION_1(VAR_2);
    FUNCTION_1(VAR_3);
    FUNCTION_1(VAR_4);
    FUNCTION_1(VAR_5);
    FUNCTION_1(VAR_6);
    FUNCTION_1(VAR_7);
    }
};

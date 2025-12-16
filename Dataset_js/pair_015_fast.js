const Benchmark = {
    run: function() {
    var VAR_1 = 100,
      VAR_2 = 125,
      VAR_3 = 0.3;
    function FUNCTION_1(VAR_4, VAR_5, VAR_6) {
      VAR_1 *= VAR_3;
      return Math.round(255 - ((255 - VAR_1) * (255 - VAR_2)) / 255);
    }
    function FUNCTION_2(VAR_7, VAR_8, VAR_9) {
      VAR_1 *= VAR_3;
      return (255 - ((255 - VAR_1) * (255 - VAR_2)) / 255) >> 0;
    }
    function FUNCTION_3(VAR_10, VAR_11, VAR_12) {
      VAR_1 *= VAR_3;
      return 255 - (((255 - VAR_1) * (255 - VAR_2)) >> 8);
    }
    FUNCTION_2(VAR_1, VAR_3, VAR_2);
    }
};

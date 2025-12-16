const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      if (VAR_1 <= 2) return VAR_1;
      return FUNCTION_1(VAR_1 - 2) + FUNCTION_1(VAR_1 - 1);
    }
    function FUNCTION_2(VAR_2) {
      if (!FUNCTION_2.VAR_3) FUNCTION_2.VAR_3 = {};
      if (VAR_2 <= 2) return VAR_2;
      return (
        FUNCTION_2.VAR_3[VAR_1] ||
        (FUNCTION_2.VAR_3[VAR_4] = FUNCTION_2(VAR_2 - 2) + FUNCTION_2(VAR_2 - 1))
      );
    }
    FUNCTION_1(10);
    }
};

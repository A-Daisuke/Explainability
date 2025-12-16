const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      if (!VAR_1) {
        return false;
      }
      if (VAR_1 === "false") {
        return false;
      }
      if (VAR_1 === "0") {
        return false;
      }
      if (VAR_1 === "null") {
        return false;
      }
      return true;
    }
    FUNCTION_1("");
    FUNCTION_1("false");
    FUNCTION_1("null");
    FUNCTION_1("0");
    FUNCTION_1("1");
    FUNCTION_1("true");
    }
};

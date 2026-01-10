const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_4) {
          return (
            VAR_4 === 0 ||
            VAR_4 === "0" ||
            (VAR_4 && VAR_4 !== true ? VAR_4 >>> 0 != 0 || (VAR_4 *= VAR_4) * VAR_4 < VAR_4 : false)
          );
        }
        FUNCTION_1("2");
        FUNCTION_1("0");
        FUNCTION_1("2.23");
    }
};
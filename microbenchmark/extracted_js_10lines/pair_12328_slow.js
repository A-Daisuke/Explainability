const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          "use strict";
          return (
            typeof VAR_1 === "number" &&
            isFinite(VAR_1) &&
            VAR_1 > -9007199254740992 &&
            VAR_1 < 9007199254740992 &&
            Math.floor(VAR_1) === VAR_1
          );
        }
        FUNCTION_1(0);
        FUNCTION_1(12);
        FUNCTION_1(-12);
        FUNCTION_1(9007199254740991);
        FUNCTION_1(-9007199254740991);
        FUNCTION_1(9007199254740992);
        FUNCTION_1(-9007199254740992);
        FUNCTION_1(12.5);
        FUNCTION_1("12");
    }
};
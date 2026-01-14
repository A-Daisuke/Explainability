const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return VAR_1 - ~~VAR_1;
        }
        function FUNCTION_3(VAR_3) {
          return VAR_3 - Math.floor(VAR_3);
        }
        function FUNCTION_4(VAR_4) {
          return VAR_4 % 1;
        }
        function FUNCTION_2(VAR_2) {
          return (VAR_2 - VAR_2) | 0;
        }
        function FUNCTION_5(VAR_5) {
          return (VAR_5 - VAR_5) >> 0;
        }
        FUNCTION_2(813789127.1829739);
        FUNCTION_2(8495894.3871273);
    }
};
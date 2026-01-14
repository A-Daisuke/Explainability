const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return Array(VAR_1).fill(0).map(Number.call, Number);
        }
        function FUNCTION_2(VAR_2) {
          return Array(VAR_2)
            .fill(0)
            .map((VAR_3, VAR_4) => VAR_4);
        }
        function FUNCTION_3(VAR_5) {
          return Array.from(Array(VAR_5)).map((VAR_6, VAR_7) => VAR_7);
        }
        function FUNCTION_4(VAR_8) {
          Array.from({ KEY_1: VAR_8 }, (VAR_9, VAR_10) => VAR_10);
        }
        FUNCTION_4(100);
    }
};
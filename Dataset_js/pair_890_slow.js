const Benchmark = {
    run: function() {
        var VAR_1 = 1000;
        var VAR_2;
        var FUNCTION_1 = function (VAR_3) {
          return (VAR_3 + VAR_3) * VAR_3;
        };
        function FUNCTION_2() {
          return {
            KEY_1: VAR_1 * VAR_1,
            KEY_2: 0,
            KEY_3: false,
          };
        }
        function FUNCTION_3(VAR_4) {
          if (++VAR_4.KEY_2 === VAR_4.KEY_1 - 1) VAR_4.KEY_3 = true;
          return VAR_4.KEY_2;
        }
        var VAR_5 = FUNCTION_2();
        while (!VAR_5.KEY_3) {
          VAR_2 = FUNCTION_1(FUNCTION_3(VAR_5));
        }
    }
};
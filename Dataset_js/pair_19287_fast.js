const Benchmark = {
    run: function() {
        var VAR_1;
        var VAR_2;
        var VAR_3;
        function FUNCTION_1(VAR_4, VAR_5, VAR_10, VAR_11) {
          VAR_2 = function () {
            VAR_1 += VAR_4 + VAR_5;
          };
          VAR_3 = function () {
            VAR_1 += VAR_10 + VAR_11;
          };
        }
        FUNCTION_1(1, 2, 3, 4);
    }
};
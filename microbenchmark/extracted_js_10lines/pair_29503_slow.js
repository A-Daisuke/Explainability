const Benchmark = {
    run: function() {
        var VAR_1 = [
          ["a", 10000],
          ["abcdef", 10000],
          [123456, 10000],
          ["abc123def567", 10000],
        ];
        function FUNCTION_1(VAR_2, VAR_3) {
          return Array.prototype.join.call({ KEY_1: VAR_3 + 1 }, VAR_2);
        }
        FUNCTION_1(VAR_1[0][0], VAR_1[0][1]);
        FUNCTION_1(VAR_1[1][0], VAR_1[1][1]);
        FUNCTION_1(VAR_1[2][0], VAR_1[2][1]);
        FUNCTION_1(VAR_1[3][0], VAR_1[3][1]);
    }
};
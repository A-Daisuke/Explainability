const Benchmark = {
    run: function() {
        var VAR_1 = "aaaaa",
          VAR_2 = "bbbbb",
          VAR_3 = "ccccc",
          VAR_4 = "ddddd",
          VAR_5 = "eeeee",
          VAR_6 = "fffff";
        function FUNCTION_1() {
          return [VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6].join("");
        }
        function FUNCTION_2() {
          return VAR_1.concat(VAR_2, VAR_3, VAR_4, VAR_5, VAR_6);
        }
        FUNCTION_1();
    }
};
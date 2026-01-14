const Benchmark = {
    run: function() {
        var VAR_1 = "variableValue",
          VAR_2,
          VAR_3 = 1,
          VAR_4 = 2,
          VAR_5 = 1,
          VAR_6 = 2,
          VAR_7 = 3,
          VAR_8 = true,
          VAR_9 = [1, 2, 3, 4, 5, 6],
          VAR_10 = 2;
        function FUNCTION_1() {}
        function FUNCTION_2() {}
        function FUNCTION_3() {}
        VAR_2 = VAR_1 === "variableValue" ? true : false;
    }
};
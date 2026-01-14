const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (!VAR_1) {
            throw VAR_2 || "Assertion failed";
          }
        }
        var VAR_3 = [];
        var VAR_4 = 1;
        while (VAR_3.length < 10) {
          var VAR_5 = VAR_4++;
          VAR_3.push(VAR_5);
        }
        FUNCTION_1(VAR_3.length == 10);
        FUNCTION_1(VAR_3[9] == 10);
    }
};
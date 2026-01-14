const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (!VAR_1) {
            throw VAR_2 || "Assertion failed";
          }
        }
        var VAR_3 = [];
        var VAR_4 = 1;
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        VAR_3.push(VAR_4++);
        FUNCTION_1(VAR_3.length == 10);
        FUNCTION_1(VAR_3[9] == 10);
    }
};
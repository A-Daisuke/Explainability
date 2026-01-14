const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = [];
        function FUNCTION_1(VAR_3) {
          var VAR_4,
            VAR_5,
            VAR_6 = VAR_3.split("");
          for (VAR_4 = 0; VAR_4 < VAR_6.VAR_7; VAR_4++) {
            VAR_5 = VAR_6.splice(VAR_4, 1);
            VAR_2.push(VAR_5);
            if (VAR_6.VAR_7 == 0) VAR_1[VAR_1.VAR_7] = VAR_2.join("");
            FUNCTION_1(VAR_6.join(""));
            VAR_6.splice(VAR_4, 0, VAR_5);
            VAR_2.pop();
          }
        }
        FUNCTION_1("1234");
    }
};
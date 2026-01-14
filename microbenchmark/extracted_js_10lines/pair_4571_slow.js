const Benchmark = {
    run: function() {
        var VAR_1 = 1440 * 5;
        function FUNCTION_1() {
          var VAR_2 = 0;
          var VAR_3 = [];
          for (var VAR_4 = 0; VAR_4 <= VAR_1; VAR_4++) {
            if (VAR_4 % 15 === 0) {
              VAR_3.push(VAR_4);
            }
          }
          return VAR_3;
        }
        FUNCTION_1();
    }
};
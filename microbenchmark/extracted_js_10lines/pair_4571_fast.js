const Benchmark = {
    run: function() {
        var VAR_1 = 1440 * 5;
        function FUNCTION_1() {
          var VAR_2 = 0;
          var VAR_3 = [];
          while (VAR_2 <= VAR_1) {
            VAR_3.push(VAR_2);
            VAR_2 += 15;
          }
          return VAR_3;
        }
        FUNCTION_1();
    }
};
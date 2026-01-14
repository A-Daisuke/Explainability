const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1,
            VAR_3 = [];
          var VAR_4;
          while (VAR_1--) {
            VAR_3.push(VAR_1);
          }
          while (VAR_2--) {
            VAR_4 = VAR_3.pop();
          }
        }
        FUNCTION_1(100);
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 === true || VAR_1 === false) return VAR_1;
          FUNCTION_2('must be "true" or "false"');
        }
        function FUNCTION_2(VAR_2) {
          throw VAR_2;
        }
        function FUNCTION_3() {
          for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {}
        }
        FUNCTION_3();
    }
};
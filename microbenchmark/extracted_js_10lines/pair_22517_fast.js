const Benchmark = {
    run: function() {
        var VAR_1 = 0;
        function FUNCTION_2(VAR_4) {
          var VAR_5 = VAR_1++;
          return VAR_4 ? VAR_4 + VAR_5 : VAR_5;
        }
        function FUNCTION_1(VAR_2) {
          var VAR_3 = VAR_1++ + "";
          return VAR_2 ? VAR_2 + VAR_3 : VAR_3;
        }
        FUNCTION_2(1);
    }
};
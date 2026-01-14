const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_4 = "",
            VAR_5 = 0,
            VAR_3 = -1;
          while ((VAR_3 = VAR_1.indexOf("-", ++VAR_3)) > -1) {
            VAR_4 += VAR_1.slice(VAR_5, VAR_3) + VAR_1.charAt(VAR_3 + 1).toUpperCase();
            VAR_5 = VAR_3 + 2;
          }
          return VAR_4 + VAR_1.slice(VAR_5);
        }
        FUNCTION_1("border-left-width");
    }
};
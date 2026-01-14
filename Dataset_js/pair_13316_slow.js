const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.split(".");
          var VAR_3 = 0;
          for (var VAR_4 = 0; VAR_4 < 4; VAR_4++) {
            VAR_3 <<= 8;
            VAR_3 += parseInt(VAR_2[VAR_4]);
          }
          return VAR_3 >>> 0;
        }
        FUNCTION_1("255.233.52.0");
        FUNCTION_1("125.133.12.5");
        FUNCTION_1("10.33.102.55");
    }
};
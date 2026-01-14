const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return [
            parseInt(VAR_1.substring(0, 2), 16),
            parseInt(VAR_1.substring(2, 4), 16),
            parseInt(VAR_1.substring(4, 6), 16),
          ];
        }
        function FUNCTION_2(VAR_2) {
          var VAR_3 = parseInt(VAR_2, 16);
          return [(VAR_3 >> 16) & 255, (VAR_3 >> 8) & 255, VAR_3 & 255];
        }
        FUNCTION_2("D345A1");
    }
};
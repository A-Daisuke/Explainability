const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (VAR_2 < 1) return "";
          var VAR_3 = "";
          while (VAR_2 > 0) {
            if (VAR_2 & 1) VAR_3 += VAR_1;
            (VAR_2 >>= 1), (VAR_1 += VAR_1);
          }
          return VAR_3;
        }
        FUNCTION_1("*", 20000);
    }
};
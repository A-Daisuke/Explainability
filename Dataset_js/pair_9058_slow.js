const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (VAR_2 === 1) {
            return VAR_1;
          }
          var VAR_3 = "";
          while (VAR_2) {
            if (VAR_2 & 1) {
              VAR_3 += VAR_1;
            }
            if ((VAR_2 >>= 1)) {
              VAR_1 += VAR_1;
            }
          }
          return VAR_3;
        }
        FUNCTION_1("abcdefg", 100000);
    }
};
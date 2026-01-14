const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return new Array(VAR_2 + 1).join(VAR_1);
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          var VAR_5 = "";
          while (--VAR_4 > -1) VAR_5 += VAR_3;
          return VAR_5;
        }
        function FUNCTION_3(VAR_6, VAR_7) {
          var VAR_8 = "";
          for (;;) {
            if (VAR_7 & 1) VAR_8 += VAR_6;
            VAR_7 >>= 1;
            if (VAR_7) VAR_6 += VAR_6;
            else break;
          }
          return VAR_8;
        }
        FUNCTION_1(" ", 1000);
    }
};
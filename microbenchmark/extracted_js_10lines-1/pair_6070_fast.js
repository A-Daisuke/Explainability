const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = "";
          while (VAR_3.length < VAR_2) VAR_3 += VAR_1;
          return VAR_3;
        }
        function FUNCTION_2(VAR_4, VAR_5) {
          var VAR_6 = "";
          for (;;) {
            if (VAR_5 & 1) VAR_6 += VAR_4;
            VAR_5 >>= 1;
            if (VAR_5) VAR_4 += VAR_4;
            else break;
          }
          return VAR_6;
        }
        FUNCTION_2("z", 100);
    }
};
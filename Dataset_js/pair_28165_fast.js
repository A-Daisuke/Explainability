const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = ((Math.random() * 9) | 0) + 1 + "",
            VAR_2 = (Math.random() * 16) | 0;
          for (; VAR_2--; VAR_1 += (Math.random() * 10) | 0) {}
          return +VAR_1;
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          if (VAR_4 === 0) {
            return VAR_3;
          } else {
            return FUNCTION_2(VAR_4, VAR_3 % VAR_4);
          }
        }
        FUNCTION_2(FUNCTION_1(), FUNCTION_1());
    }
};
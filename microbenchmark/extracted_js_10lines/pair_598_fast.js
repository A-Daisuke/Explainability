const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 === 1) return false;
          else if (VAR_1 === 2) return true;
          else if (VAR_1 !== undefined) {
            var VAR_2 = 1;
            var VAR_3 = Math.ceil(Math.sqrt(VAR_1));
            while (++VAR_2 <= VAR_3) {
              if (VAR_1 % VAR_2 === 0) {
                return false;
              }
            }
            return true;
          }
        }
        FUNCTION_1(999983);
    }
};
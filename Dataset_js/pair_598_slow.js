const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 === 1) return false;
          else if (VAR_1 === 2) return true;
          else if (VAR_1 !== undefined) {
            var VAR_2 = 2;
            var VAR_3 = true;
            while (VAR_2 < VAR_1) {
              if (VAR_1 % VAR_2 === 0) {
                VAR_3 = false;
                break;
              } else {
                VAR_2++;
              }
            }
            return VAR_3;
          }
        }
        FUNCTION_1(999983);
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          VAR_1 &= -(VAR_1 >= 0);
          return (VAR_1 | ((255 - VAR_1) >> 31)) & 255;
        }
        function FUNCTION_2(VAR_2) {
          return Math.max(Math.min(VAR_2, 255), 0);
        }
        for (var VAR_3 = -1000, VAR_4 = 0; VAR_3 < 1000; VAR_3++) {
          VAR_4 = FUNCTION_2(VAR_3);
        }
    }
};
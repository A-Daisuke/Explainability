const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = 0,
            VAR_4 = (VAR_1 || []).length;
          if (!VAR_2) {
            return null;
          }
          for (; VAR_3 < VAR_4; VAR_3++) {
            if (VAR_2(VAR_1[VAR_3])) {
              return VAR_1[VAR_3];
            }
          }
          return null;
        }
        var VAR_5 = [1, 2, 3, 4, 5, 6, 7, 8];
        var VAR_6 = FUNCTION_1(VAR_5, function (VAR_7) {
          VAR_7 % 2 == 0;
        });
    }
};
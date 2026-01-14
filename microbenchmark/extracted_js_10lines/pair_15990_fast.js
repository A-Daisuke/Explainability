const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = 0,
            VAR_4 = (VAR_1 || []).length,
            VAR_8 = [];
          if (!VAR_2) {
            return null;
          }
          if (VAR_4 !== undefined) {
            for (; VAR_3 < VAR_4; VAR_3++) {
              VAR_2(VAR_3, VAR_1[VAR_3]);
            }
          } else {
            for (var VAR_9 in VAR_1) {
              VAR_2(VAR_9, VAR_1[VAR_9]);
            }
          }
        }
        var VAR_10 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        };
        FUNCTION_1(VAR_10, function (VAR_11, VAR_12) {
          var VAR_13 = VAR_11;
        });
    }
};
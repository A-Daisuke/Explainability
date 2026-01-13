const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = 0,
            VAR_4 = VAR_2.length,
            VAR_5;
          for (; VAR_3 < VAR_4; VAR_3++) {
            if (VAR_3 in VAR_2 && VAR_2[VAR_3] === VAR_1) {
              if (VAR_5) {
                return false;
              }
              VAR_5 = !VAR_5;
            }
          }
          return !!VAR_5;
        }
        var VAR_6 = [0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 9, 4, 4, 4, 4, 5, 5, 5, 7];
        FUNCTION_1(2, VAR_6);
    }
};
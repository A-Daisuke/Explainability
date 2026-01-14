const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          VAR_2,
          VAR_3;
        var VAR_4;
        try {
          for (VAR_2 = 0, VAR_3 = VAR_1.length; VAR_2 < VAR_3; ++VAR_2) {
            VAR_4 = VAR_2 + 1;
          }
        } catch (VAR_5) {
          console.log(VAR_5);
        }
    }
};
const Benchmark = {
    run: function() {
        var VAR_1, VAR_2, VAR_3;
        VAR_2 = [1, 2, 3, 4, 5, 6, 7, 8];
        VAR_3 = 42;
        for (VAR_1 = 0; VAR_1 < 1000; VAR_1++) {
          if (Math.random() < 0.999999999999999) {
            VAR_3 = [1, 2, 3, 4, 5, 6, 7, 8];
            VAR_2 = 42;
          }
        }
        if (VAR_2.constructor == Number) VAR_2++;
        if (VAR_3.constructor == Number) VAR_3++;
    }
};
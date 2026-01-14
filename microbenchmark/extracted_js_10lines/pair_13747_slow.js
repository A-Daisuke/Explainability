const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6, VAR_7, VAR_8) {
          return VAR_1 + VAR_2 + VAR_3 + VAR_4 + VAR_5 + VAR_6 + VAR_7 + VAR_8;
        }
        var VAR_9 = [1, 2, 3, 4, 5, 6, 7, 8];
        var VAR_10 = [1, 2, 3, 4];
        var VAR_11 = [5, 6, 7, 8];
        var VAR_12 = {
          KEY_1: VAR_10,
          4: 4,
          5: 5,
          6: 6,
          7: 7,
          KEY_2: 8,
        };
        FUNCTION_1.apply(this, VAR_10.concat(VAR_11));
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = ["Blue", "Teal", "Green", "Purple"],
          VAR_2 = [2, 6, 1, 4, 8, 3, 5];
        function FUNCTION_1(VAR_3) {
          var VAR_4 = VAR_1[Math.floor(VAR_3 / VAR_2.length) % VAR_1.length],
            VAR_5 = VAR_2[VAR_3 % VAR_2.length];
          return "color" + VAR_4 + VAR_5;
        }
        var VAR_6 = 50;
        var VAR_7;
        for (VAR_7 = 0; VAR_7 < VAR_6; VAR_7++) {
          FUNCTION_1(VAR_7);
        }
    }
};
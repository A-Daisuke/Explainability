const Benchmark = {
    run: function() {
        var VAR_1 = [
          [0.1, 0.2],
          [-0.1, 0.2],
          [0.1, -0.2],
          [0.1, 0],
          [0, 0.2],
          [-0.1, 0],
          [0, -0.2],
        ];
        var VAR_2 = 0.2;
        var VAR_3 = VAR_2 * VAR_2;
        function FUNCTION_1(VAR_4) {
          return Math.abs(VAR_4[0]) < VAR_3 && Math.abs(VAR_4[1]) < VAR_3;
        }
        for (var VAR_5 = 0; VAR_5 < VAR_1.length; VAR_5++) FUNCTION_1(VAR_1[VAR_5]);
    }
};
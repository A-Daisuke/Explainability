const Benchmark = {
    run: function() {
        var VAR_1 = [
          502, 806, 787, 948, 813, 334, 949, 561, 213, 95, 199, 562, 175, 698, 470, 304,
          849, 766, 558, 89,
        ];
        function FUNCTION_1(VAR_2) {
          return VAR_2 << 1;
        }
        for (var VAR_4 = 0, VAR_5; (VAR_5 = VAR_1[VAR_4++]); ) {
          FUNCTION_1(VAR_5);
        }
    }
};
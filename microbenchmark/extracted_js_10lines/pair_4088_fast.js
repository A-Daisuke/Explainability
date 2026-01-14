const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_6 = String(VAR_2)
              .replace(/\[(\d+)\]/g, ".$1")
              .split("."),
            VAR_7 = VAR_1,
            VAR_8,
            VAR_9 = VAR_6.length;
          for (VAR_8 = 0; VAR_8 < VAR_9; VAR_8++) {
            if (VAR_7 === null || VAR_7 === undefined) break;
            VAR_7 = VAR_7[VAR_6[VAR_8]];
          }
          return VAR_7;
        }
        var VAR_5 = {
          KEY_1: [
            1,
            2,
            3,
            {
              KEY_2: {
                KEY_3: [4, 5],
              },
            },
          ],
        };
        FUNCTION_1(VAR_5, "a[3].d.c[1]");
    }
};
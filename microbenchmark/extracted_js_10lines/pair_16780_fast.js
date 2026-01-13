const Benchmark = {
    run: function() {
        var VAR_1 = 100000;
        FUNCTION_1(VAR_1);
        function FUNCTION_1(VAR_2) {
          var VAR_6 = -1;
          var VAR_7 = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
          do {
            VAR_2 = VAR_2 / 1024;
            VAR_6++;
          } while (VAR_2 > 1024);
          return Math.max(VAR_2, 0.1).toFixed(1) + VAR_7[VAR_6];
        }
    }
};
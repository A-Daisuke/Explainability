const Benchmark = {
    run: function() {
        var VAR_1 = 100000;
        FUNCTION_1(VAR_1);
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_4 = VAR_3 ? 1000 : 1024;
          if (Math.abs(VAR_2) < VAR_4) {
            return VAR_2 + " B";
          }
          var VAR_5 = VAR_3
            ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
            : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
          var VAR_6 = -1;
          do {
            VAR_2 /= VAR_4;
            ++VAR_6;
          } while (Math.abs(VAR_2) >= VAR_4 && VAR_6 < VAR_5.length - 1);
          return VAR_2.toFixed(1) + " " + VAR_5[VAR_6];
        }
    }
};
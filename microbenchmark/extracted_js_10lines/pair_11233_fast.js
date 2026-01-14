const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "p",
          KEY_2: "h",
        };
        var VAR_2 = 10000;
        function FUNCTION_1(VAR_3) {
          if (/(heading|normal)/i.test(VAR_3)) {
            VAR_3 = VAR_3.replace(
              /(heading|normal)\s*/i,
              function (VAR_4) {
                return VAR_1[VAR_4.trim().toLowerCase()];
              },
            );
          }
          return VAR_3;
        }
        FUNCTION_1("hello");
    }
};
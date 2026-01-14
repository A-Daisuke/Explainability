const Benchmark = {
    run: function() {
        var VAR_1 = "classification.style";
        var VAR_2 = "condition";
        var VAR_3;
        var VAR_4;
        for (var VAR_5 = 0, VAR_6 = 15000; VAR_5 < VAR_6; VAR_5++) {
          if (VAR_1.split(".").length) {
            VAR_3 = true;
          }
          if (VAR_2.split(".").length) {
            VAR_3 = true;
          }
        }
    }
};
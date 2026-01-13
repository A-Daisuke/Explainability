const Benchmark = {
    run: function() {
        var VAR_1;
        var VAR_2 = null;
        var VAR_3 = 5;
        var VAR_4 = 5;
        var VAR_5 = {
          KEY_1: 5,
          KEY_2: 10,
        };
        var VAR_6 = {
          KEY_3: 5,
          KEY_4: 10,
        };
        var VAR_7 = "Ala ma kota.";
        var VAR_8 = "Ala ma kota.";
        var VAR_9 = 0;
        if (VAR_1 == VAR_2) {
          ++VAR_9;
        }
        if (VAR_3 == VAR_2) {
          ++VAR_9;
        }
        if (VAR_3 == VAR_7) {
          ++VAR_9;
        }
        if (VAR_7 == VAR_5) {
          ++VAR_9;
        }
    }
};
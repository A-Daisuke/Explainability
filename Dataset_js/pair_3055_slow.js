const Benchmark = {
    run: function() {
        var VAR_1 = {};
        var VAR_2 = {};
        var VAR_3 = "var obj3 = {";
        for (var VAR_4 = 0; VAR_4 < 10000; VAR_4++) {
          VAR_2["prop" + VAR_4] = false;
          VAR_3 += "prop" + VAR_4 + ":" + false + ",";
        }
        VAR_3 += "};";
        eval(VAR_3);
        for (var VAR_5 = 0; VAR_4 < 10000; VAR_4++) {
          obj3["prop" + VAR_4] = true;
        }
    }
};
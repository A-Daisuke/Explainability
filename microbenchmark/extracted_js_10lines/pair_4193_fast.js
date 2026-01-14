const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = {};
        for (var VAR_3 = 0; VAR_3 < 1000; ++VAR_3) {
          VAR_1.push("ele_" + VAR_3);
          VAR_2["ele_" + VAR_3] = true;
        }
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_3 < 10; ++VAR_3) {
          var VAR_6 = "ele_" + VAR_3 * 99;
          if (VAR_2[VAR_6]) VAR_4.push(VAR_6);
        }
    }
};
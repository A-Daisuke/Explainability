const Benchmark = {
    run: function() {
        var VAR_1 = "",
          VAR_2 = "",
          VAR_3;
        for (VAR_3 = 0; VAR_3 < 100; VAR_3++) {
          VAR_1 += "1234567890";
        }
        for (VAR_3 = 0; VAR_3 < 100; VAR_3++) {
          VAR_2 += VAR_1;
        }
        VAR_2 += "abcdef";
        VAR_2.indexOf("abcdef");
    }
};
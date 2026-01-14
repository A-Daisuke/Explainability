const Benchmark = {
    run: function() {
        var VAR_1 = ["this", "is", "a", "test"];
        var VAR_2 = 0;
        var VAR_3 = 16;
        var VAR_4;
        var VAR_5 = /z/;
        var VAR_6;
        var VAR_7 = "";
        for (VAR_4 = 0; VAR_4 < VAR_3; ++VAR_4) {
          VAR_7 += " ";
          VAR_7 += VAR_1[VAR_4 & 3];
          VAR_7 += VAR_2++;
        }
        VAR_6 = VAR_5.test(VAR_7);
    }
};
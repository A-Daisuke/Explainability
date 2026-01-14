const Benchmark = {
    run: function() {
        var VAR_1 = {};
        var VAR_2;
        var VAR_3;
        VAR_1.VAR_4 = 1;
        VAR_1.VAR_5 = 2;
        VAR_1.VAR_6 = 3;
        VAR_1.VAR_7 = 4;
        VAR_1.VAR_8 = 5;
        VAR_2 = 0;
        for (VAR_3 in VAR_1) VAR_2++;
        VAR_1 = {};
    }
};
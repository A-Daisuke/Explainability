const Benchmark = {
    run: function() {
        var VAR_1 = "testtesttest";
        var VAR_2 = "testtesttesttesttesttesttesttesttesttesttesttesttesttest";
        var VAR_3 = /^test/;
        var VAR_4 = /^tes0/;
        var VAR_5 = /^testtesttest/;
        var VAR_6 = /^testtes0test/;
        VAR_2.indexOf("test") >= 0;
        VAR_2.indexOf("tes0") >= 0;
        VAR_2.indexOf("testtesttest") >= 0;
        VAR_2.indexOf("testtes0test") >= 0;
    }
};
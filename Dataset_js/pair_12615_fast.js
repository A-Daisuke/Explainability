const Benchmark = {
    run: function() {
        var VAR_1 = "testtesttest";
        var VAR_2 = "testtesttesttesttesttesttesttesttesttesttesttesttesttest";
        var VAR_3 = /^test/;
        var VAR_4 = /^tes0/;
        var VAR_5 = /^testtesttest/;
        var VAR_6 = /^testtes0test/;
        VAR_2.substr(0, 4) == "test";
        VAR_2.substr(0, 4) == "tes0";
        VAR_2.substr(0, 12) == "testtesttest";
        VAR_2.substr(0, 12) == "testtes0test";
    }
};
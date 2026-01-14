const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "abcdef",
          KEY_2: "abcdef",
          KEY_3: "abcdef",
          KEY_4: "abcdef",
          KEY_5: "abcdef",
          KEY_6: "abcdef",
          KEY_7: "abcdef",
          KEY_8: "abcdef",
        };
        (function (VAR_3) {
          var VAR_2 = "";
          VAR_2 += VAR_3.KEY_1;
          VAR_2 += VAR_3.KEY_2;
          VAR_2 += VAR_3.KEY_3;
          VAR_2 += VAR_3.KEY_4;
          VAR_2 += VAR_3.KEY_5;
          VAR_2 += VAR_3.KEY_6;
          VAR_2 += VAR_3.KEY_7;
          VAR_2 += VAR_3.KEY_8;
        })(VAR_1);
    }
};
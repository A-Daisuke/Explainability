const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function () {},
          KEY_2: function () {},
          KEY_3: function () {},
        };
        var VAR_2 = {
          KEY_4: VAR_1.KEY_4,
          KEY_5: VAR_1.KEY_5,
          KEY_6: VAR_1.KEY_6,
          KEY_7: 777,
          KEY_8: "str",
          KEY_9: {},
        };
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: true,
          KEY_2: "II",
          KEY_3: "III",
          KEY_4: "IV",
          KEY_5: 5,
          KEY_6: 6,
          KEY_7: 7,
          KEY_8: 8,
          KEY_9: 9,
          KEY_10: "Really ten!",
        };
        function FUNCTION_1() {}
        for (var VAR_2 = 0, VAR_3; (VAR_3 = Object.keys(VAR_1)[VAR_2++]); ) {
          FUNCTION_1(VAR_1[VAR_3]);
        }
    }
};
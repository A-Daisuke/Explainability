const Benchmark = {
    run: function() {
        var VAR_1 = ["aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh"];
        var VAR_2 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
          KEY_4: 4,
          KEY_5: 5,
          KEY_6: 6,
          KEY_7: 6,
          KEY_8: 7,
        };
        function FUNCTION_1(VAR_3, VAR_4) {
          for (var VAR_5 = 0; VAR_5 < VAR_3.length; VAR_5++) {
            if (VAR_3[VAR_5] === VAR_4) return true;
          }
          return false;
        }
        var VAR_6 = FUNCTION_1(VAR_1, "hh");
    }
};
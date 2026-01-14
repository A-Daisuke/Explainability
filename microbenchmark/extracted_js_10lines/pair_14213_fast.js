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
          if (VAR_3.indexOf(VAR_4) != -1) {
            return true;
          }
          return false;
        }
        var VAR_6 = FUNCTION_1(VAR_1, "hh");
    }
};
const Benchmark = {
    run: function() {
        (function () {
          var VAR_1 = Math.floor(Math.random() * 10 + 1);
          if (VAR_1 == 0 || VAR_1 == 1 || VAR_1 == 2 || VAR_1 == 10) {
            return "UA-199689-51";
          } else if (VAR_1 == 3 || VAR_1 == 4 || VAR_1 == 5) {
            return "UA-199689-52";
          } else if (VAR_1 == 6 || VAR_1 == 7) {
            return "UA-199689-53";
          } else if (VAR_1 == 8 || VAR_1 == 9) {
            return "UA-199689-54";
          }
        })();
    }
};
const Benchmark = {
    run: function() {
        (function () {
          var VAR_1 = Math.floor(Math.random() * 10 + 1).toString();
          if (VAR_1.charAt(0) == 0 || VAR_1.charAt(0) == 1 || VAR_1.charAt(0) == 2) {
            return "UA-199689-51";
          } else if (
            VAR_1.charAt(0) == 3 ||
            VAR_1.charAt(0) == 4 ||
            VAR_1.charAt(0) == 5
          ) {
            return "UA-199689-52";
          } else if (VAR_1.charAt(0) == 6 || VAR_1.charAt(0) == 7) {
            return "UA-199689-53";
          } else if (VAR_1.charAt(0) == 8 || VAR_1.charAt(0) == 9) {
            return "UA-199689-54";
          }
        })();
    }
};
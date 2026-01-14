const Benchmark = {
    run: function() {
        var VAR_1 = new Array(20)
          .join("s")
          .split("s")
          .map(function (VAR_2) {
            return parseInt(Math.random() * 10, 10);
          })
          .join("");
        function FUNCTION_1(VAR_3) {
          for (var VAR_4 = 1, VAR_5 = VAR_3.length; VAR_4 < VAR_5; VAR_4++) {
            if ((VAR_3[VAR_4] % 2) + (VAR_3[VAR_4 - 1] % 2) == 0) {
              VAR_3.splice(VAR_4, 0, "-");
              VAR_4--;
              VAR_5++;
            }
          }
        }
        var VAR_6 = "43268356925485942568".split("");
        FUNCTION_1(VAR_6);
        var VAR_7 = VAR_6.join("");
    }
};
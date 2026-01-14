const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (Object.prototype.toString.call(VAR_1) !== "[object Array]")
            VAR_1 = [VAR_1];
          VAR_1 = new RegExp(VAR_1.join("|"), "igm");
          return function (VAR_2) {
            return VAR_1.test(VAR_2);
          };
        }
        var VAR_5 = FUNCTION_1(["hi", "bye"]);
        VAR_5("hd");
    }
};
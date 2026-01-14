const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (Object.prototype.toString.call(VAR_1) !== "[object Array]")
            VAR_1 = [VAR_1];
          return function (VAR_2) {
            for (var VAR_3 = 0, VAR_4 = VAR_1.length; VAR_3 < VAR_4; ++VAR_3) {
              if (new RegExp(".*" + VAR_1[VAR_3] + ".*", "igm").test(VAR_2)) return true;
            }
            return false;
          };
        }
        var VAR_5 = FUNCTION_1(["hi", "bye"]);
        VAR_5("hi");
    }
};
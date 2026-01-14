const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return (function () {
            return function (VAR_2) {
              return VAR_2[VAR_1];
            };
          })();
        }
        function FUNCTION_2(VAR_3) {
          return new Function("obj", "return obj." + VAR_3);
        }
        var VAR_4 = FUNCTION_1("foo");
        var VAR_5 = FUNCTION_2("foo");
        var VAR_6 = { KEY_1: "blah" };
        FUNCTION_1("foo")(VAR_6);
    }
};
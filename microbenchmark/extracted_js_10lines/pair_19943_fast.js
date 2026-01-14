const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          for (var VAR_2 = 1; VAR_2 < arguments.length; VAR_2++) {
            VAR_1 = VAR_1[arguments[VAR_2]];
            if (VAR_1 === undefined) {
              break;
            }
          }
          return VAR_1;
        }
        var VAR_3 = {};
        var VAR_7 = { KEY_6: "bar" };
        var VAR_5 = { KEY_3: { KEY_4: { KEY_5: "bazinga" } } };
        var VAR_8 = FUNCTION_1(VAR_7, "foo");
    }
};
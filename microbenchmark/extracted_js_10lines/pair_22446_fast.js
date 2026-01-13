const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: false,
          KEY_2: true,
          KEY_3: true,
          KEY_4: false,
          KEY_5: false,
          undefined: false,
        };
        function FUNCTION_2(VAR_3) {
          return VAR_1[typeof VAR_3];
        }
        var VAR_4 = Object.isObject;
        function FUNCTION_3(VAR_5) {
          var VAR_6;
          return (
            VAR_5 !== null && ((VAR_6 = typeof VAR_5) === "object" || VAR_6 === "function")
          );
        }
        function FUNCTION_1(VAR_2) {
          return VAR_2 !== null && (typeof VAR_2 === "object" || typeof VAR_2 === "function");
        }
        FUNCTION_1("qweasdzxc");
    }
};
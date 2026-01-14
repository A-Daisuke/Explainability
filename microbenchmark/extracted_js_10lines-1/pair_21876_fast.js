const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "one",
          KEY_2: null,
        };
        var VAR_2 = "p1";
        var VAR_3 = "p2";
        var VAR_4 = "p3";
        function FUNCTION_1() {
          typeof VAR_1.KEY_1 !== "undefined";
          typeof VAR_1.KEY_2 !== "undefined";
          typeof VAR_1.VAR_4 !== "undefined";
        }
        function FUNCTION_2() {
          typeof VAR_1[KEY_1] !== "undefined";
          typeof VAR_1[KEY_2] !== "undefined";
          typeof VAR_1[VAR_4] !== "undefined";
        }
        FUNCTION_1();
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = {
          "\n": FUNCTION_1,
          "\t": FUNCTION_1,
          " ": FUNCTION_1,
        };
        var VAR_2;
        var VAR_3 = /[\n\r ]/;
        function FUNCTION_2(VAR_4) {
          VAR_2 = VAR_4;
        }
        function FUNCTION_1() {}
        var VAR_5 = String.fromCharCode(Math.floor(Math.random() * 128));
        if (VAR_5 === "\n" || VAR_5 === "\t" || VAR_5 === " ") {
        } else {
          FUNCTION_2(VAR_5);
        }
    }
};
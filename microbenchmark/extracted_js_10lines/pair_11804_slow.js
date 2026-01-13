const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (!VAR_1) {
            throw "BAD!";
          }
        }
        function FUNCTION_2(VAR_2) {
          return VAR_2.split(".").slice(1).pop() || false;
        }
        FUNCTION_1(FUNCTION_2("abc.png") == "png");
        FUNCTION_1(FUNCTION_2("abc.123.png") == "png");
        FUNCTION_1(FUNCTION_2("abc") === false);
        FUNCTION_1(FUNCTION_2("abc.b.s.df.g.h.d.s.a.png") == "png");
    }
};
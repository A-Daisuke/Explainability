const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (!VAR_1) {
            throw "BAD!";
          }
        }
        var VAR_3 = /.*\.([^.]*)$/;
        function FUNCTION_2(VAR_2) {
          var VAR_4 = VAR_2.match(VAR_3);
          return VAR_4 ? VAR_4[1] || false : false;
        }
        FUNCTION_1(FUNCTION_2("abc.png") == "png");
        FUNCTION_1(FUNCTION_2("abc.123.png") == "png");
        FUNCTION_1(FUNCTION_2("abc") === false);
        FUNCTION_1(FUNCTION_2("abc.b.s.df.g.h.d.s.a.png") == "png");
    }
};
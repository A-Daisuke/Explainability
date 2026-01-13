const Benchmark = {
    run: function() {
        var VAR_1 = { KEY_1: { KEY_2: { KEY_3: "buzz" } } };
        function FUNCTION_1(VAR_2, VAR_3) {
          if (typeof VAR_3 === "string") {
            VAR_3 = VAR_3.split(".");
          }
          return VAR_3.reduce(function (VAR_4, VAR_5) {
            return (VAR_4 || {})[VAR_5];
          }, VAR_1);
        }
        FUNCTION_1(VAR_1, "foo.bar.fizz");
        FUNCTION_1(VAR_1, "foo.bar.fizzbuzzle.foofizzbuzzle.djkasiosdopa.dsakopdsa");
    }
};
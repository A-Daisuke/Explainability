const Benchmark = {
    run: function() {
        var VAR_1 = { KEY_1: { KEY_2: { KEY_3: "buzz" } } };
        function FUNCTION_1(VAR_2, VAR_3) {
          if (typeof VAR_3 === "string") {
            VAR_3 = VAR_3.split(".");
          }
          for (var VAR_6 = 0, VAR_7 = VAR_3.VAR_7; VAR_1 && VAR_6 < VAR_7; VAR_6++) {
            VAR_1 = VAR_1[VAR_3[VAR_6]];
          }
          return VAR_1;
        }
        FUNCTION_1(VAR_1, "foo.bar.fizz");
        FUNCTION_1(VAR_1, "foo.bar.fizzbuzzle.foofizzbuzzle.djkasiosdopa.dsakopdsa");
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return [].slice.call(arguments, 1, arguments.length);
        }
        function FUNCTION_2(VAR_3) {
          return VAR_3;
        }
        FUNCTION_2({
          KEY_3: 1,
          KEY_4: 2,
          KEY_5: 3,
          KEY_6: 4,
          KEY_7: "a string",
          KEY_8: {
            KEY_1: "an object",
            KEY_2: 42,
          },
        });
    }
};
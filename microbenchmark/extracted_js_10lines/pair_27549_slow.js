const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          Reflect.defineProperty({}, "foo", {
            KEY_1: () => 1,
            KEY_2: () => {},
          });
        }
        function FUNCTION_2() {
          Reflect.defineProperty({}, "foo", {
            KEY_3: null,
            KEY_4: () => 1,
          });
        }
        FUNCTION_2();
    }
};
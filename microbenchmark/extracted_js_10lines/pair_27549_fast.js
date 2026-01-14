const Benchmark = {
    run: function() {
        function FUNCTION_2() {
          Reflect.defineProperty({}, "foo", { KEY_4: () => 1 });
        }
        function FUNCTION_1() {
          Reflect.defineProperty({}, "foo", {
            KEY_1: () => 1,
            KEY_2: () => {},
          });
        }
        FUNCTION_2();
    }
};
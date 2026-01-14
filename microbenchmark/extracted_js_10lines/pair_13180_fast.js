const Benchmark = {
    run: function() {
        function FUNCTION_2() {
          return Math.floor(Math.random() * ~(1 << 31) * 2);
        }
        function FUNCTION_1() {
          return Math.floor(Math.random() * 4294967294);
        }
        function FUNCTION_3() {
          return parseInt(Math.random() * 4294967294);
        }
        FUNCTION_2();
    }
};
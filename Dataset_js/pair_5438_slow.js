const Benchmark = {
    run: function() {
        function* FUNCTION_1() {
          yield 1;
          yield 2;
          yield 3;
          yield 4;
          yield 5;
          yield 6;
          yield 7;
          yield 8;
          yield 9;
          yield 10;
        }
        for (let VAR_1 of FUNCTION_1()) {
        }
    }
};
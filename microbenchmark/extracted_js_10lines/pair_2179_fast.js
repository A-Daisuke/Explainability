const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1 = {}) {
          for (let VAR_2 = 0; VAR_2 < 1000; VAR_2++)
            VAR_1["_" + VAR_2] =
              Math.random > 0.95
                ? ~~(Math.random * 2)
                  ? "foo"
                  : "bar"
                : ~~(Math.random * 100);
          return VAR_1;
        }
        const VAR_3 = FUNCTION_1({});
        const VAR_4 = Object.keys(VAR_3).length;
    }
};
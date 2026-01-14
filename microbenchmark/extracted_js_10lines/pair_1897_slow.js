const Benchmark = {
    run: function() {
        var VAR_1 = [
          ...Array(1000).fill(null),
          ...Array(100).fill("foo"),
          ...Array(100).fill(null),
          ...Array(100).fill("bar"),
          ...Array(1000).fill(null),
        ];
        const FUNCTION_1 = (VAR_2) => !!VAR_2;
        function FUNCTION_2() {
          const VAR_3 = VAR_1.findIndex(FUNCTION_1);
          VAR_1.reverse();
          const VAR_4 = VAR_1.findIndex(FUNCTION_1);
          return VAR_1
            .reverse()
            .slice(VAR_3, VAR_1.length - VAR_4);
        }
        FUNCTION_2(VAR_1);
    }
};
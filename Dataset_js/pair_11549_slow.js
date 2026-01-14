const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          for (let VAR_3 = 0; VAR_3 < VAR_2; VAR_3++) {
            VAR_1.push(Math.random());
          }
        }
        const VAR_4 = [];
        const VAR_5 = [];
        const VAR_6 = [];
        FUNCTION_1(VAR_4, 10);
        while (VAR_4.length > 0) VAR_4.pop();
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return new Date(
            VAR_1.getTime() + Math.random() * (VAR_2.getTime() - VAR_1.getTime()),
          );
        }
        const VAR_3 = Array(100000);
        VAR_3.fill(FUNCTION_1(new Date(2012, 0, 1), new Date()).getTime() / 1000);
        VAR_3.sort((VAR_4, VAR_5) => {
          if (VAR_4 === VAR_5) return 0;
          return VAR_4 < VAR_5 ? 1 : -1;
        });
    }
};
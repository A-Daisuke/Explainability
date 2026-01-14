const Benchmark = {
    run: function() {
        var VAR_1 = 10000;
        function FUNCTION_1(VAR_2, VAR_3) {
          if (VAR_2 !== VAR_3) {
            throw new Error(`Not equals, actual:'${VAR_2}', expected '${VAR_3}'.`);
          }
        }
        var VAR_4 = {
          KEY_1: 0,
          KEY_2: function () {
            this.KEY_1 += 1;
          },
        };
        var VAR_5 = new Proxy(VAR_4, {
          KEY_3: function (VAR_6, VAR_7, VAR_8) {
            return VAR_4[VAR_7];
          },
        });
        for (var VAR_9 = 0; VAR_9 < VAR_1; VAR_9 += 1) {
          VAR_5.KEY_2();
        }
        FUNCTION_1(VAR_5.KEY_1, VAR_1);
    }
};
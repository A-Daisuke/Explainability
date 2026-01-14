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
        var VAR_5 = Proxy.revocable(VAR_4, {
          KEY_3: function (VAR_6, VAR_7, VAR_8) {
            return VAR_4[VAR_7];
          },
        });
        var VAR_9 = VAR_5.proxy;
        for (var VAR_10 = 0; VAR_10 < VAR_1; VAR_10 += 1) {
          VAR_9.KEY_2();
        }
        FUNCTION_1(VAR_9.KEY_1, VAR_1);
    }
};
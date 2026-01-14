const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = 1;
          this.VAR_2 = 2;
          this.VAR_3 = (function () {
            var VAR_4 = 100;
            while (VAR_4--);
            return 10;
          })();
        }
        function FUNCTION_2() {}
        FUNCTION_2.VAR_5 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: (function () {
            var VAR_6 = 100;
            while (VAR_6--);
            return 10;
          })(),
        };
        var VAR_7 = FUNCTION_1.VAR_1;
        var VAR_8 = FUNCTION_1.VAR_2;
        var VAR_9 = FUNCTION_1.VAR_3;
    }
};
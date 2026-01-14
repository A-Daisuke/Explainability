const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          this.VAR_3 = VAR_1;
          this.VAR_4 = VAR_2;
        };
        FUNCTION_1.VAR_5 = {
          KEY_1: function (VAR_6) {
            return this.VAR_3 + " says " + VAR_6;
          },
        };
        var VAR_8 = (function () {
          return {
            KEY_2: function (VAR_9, VAR_10) {
              return Object.create(FUNCTION_1.VAR_5);
            },
          };
        })();
        var VAR_11 = VAR_8.KEY_2("Ron", "Swanson");
    }
};
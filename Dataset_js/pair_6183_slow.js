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
        var VAR_7 = new FUNCTION_1("Ron", "Swanson");
    }
};
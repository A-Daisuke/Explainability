const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "value",
          KEY_2: function () {
            return this.KEY_1;
          },
        };
        function FUNCTION_1() {}
        if (VAR_1.KEY_2()) {
          FUNCTION_1(VAR_1.KEY_2());
        }
    }
};
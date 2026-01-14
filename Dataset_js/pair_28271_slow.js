const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        };
        var VAR_2 = "onetwothree";
        Array.prototype.VAR_3 = true;
        Array.FUNCTION_1 = function (VAR_4) {
          return Object.prototype.toString.call(VAR_4) === "[object Array]";
        };
        var VAR_5 = Array.isArray(VAR_2);
    }
};
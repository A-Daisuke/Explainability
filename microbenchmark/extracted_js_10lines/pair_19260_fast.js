const Benchmark = {
    run: function() {
        var VAR_1 = ["one", "two", "three"];
        var VAR_2 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        };
        var VAR_3 = "onetwothree";
        Array.prototype.VAR_4 = true;
        Array.FUNCTION_1 = function (VAR_5) {
          return Object.prototype.toString.call(VAR_5) === "[object Array]";
        };
        var VAR_6 = VAR_1.VAR_4;
    }
};
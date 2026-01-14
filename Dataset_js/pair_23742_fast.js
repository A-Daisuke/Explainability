const Benchmark = {
    run: function() {
        var VAR_1 = "";
        var VAR_2 = new String("");
        var VAR_3 = [];
        var VAR_4 = {};
        var FUNCTION_1 = function () {};
        var VAR_5 = new Date();
        function FUNCTION_2(VAR_6) {
          return Object.prototype.toString.call(VAR_6) === "[object Array]";
        }
        typeof VAR_3 === "object";
    }
};
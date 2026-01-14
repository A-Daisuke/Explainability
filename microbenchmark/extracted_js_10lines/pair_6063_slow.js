const Benchmark = {
    run: function() {
        var VAR_1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var VAR_2 = 16;
        var FUNCTION_1 = function () {
          var VAR_3 = "";
          for (var VAR_4 = 0; VAR_4 < VAR_2; ++VAR_4) {
            VAR_3 += VAR_1.charAt(Math.floor(Math.random() * VAR_1.length));
          }
          return VAR_3;
        };
        var FUNCTION_2 = function () {
          return Math.random().toString(36);
        };
        var FUNCTION_3 = function () {
          return Math.random().toString().substr(2);
        };
        FUNCTION_1();
    }
};
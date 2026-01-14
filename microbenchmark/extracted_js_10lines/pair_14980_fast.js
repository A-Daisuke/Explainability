const Benchmark = {
    run: function() {
        var VAR_1 = [].toString;
        var VAR_2 = Object.prototype.toString;
        function FUNCTION_1(VAR_3) {
          return VAR_1.call(VAR_3).slice(8, -1);
        }
        function FUNCTION_2(VAR_4) {
          return VAR_2.call(VAR_4).slice(8, -1);
        }
        function FUNCTION_3(VAR_5) {
          return [].slice.call(VAR_5).slice(8, -1);
        }
        function FUNCTION_4(VAR_6) {
          return Object.prototype.toString.call(VAR_6).slice(8, -1);
        }
        var VAR_7 = "test";
        var VAR_8 = {};
        var VAR_9 = /test/;
        FUNCTION_4(VAR_8);
        FUNCTION_4(VAR_7);
        FUNCTION_4(VAR_9);
    }
};
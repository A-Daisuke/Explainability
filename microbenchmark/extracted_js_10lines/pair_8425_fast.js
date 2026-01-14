const Benchmark = {
    run: function() {
        var VAR_1 = new Date();
        function FUNCTION_1(VAR_3) {
          return {
            KEY_8: VAR_1.getFullYear(),
            KEY_9: VAR_1.getMonth() + 1,
            KEY_10: VAR_1.getDate(),
            KEY_11: VAR_1.getHours(),
            KEY_12: VAR_1.getMinutes(),
            KEY_13: VAR_1.getSeconds(),
            KEY_14: VAR_1.getMilliseconds(),
          };
        }
        FUNCTION_1(VAR_1);
    }
};
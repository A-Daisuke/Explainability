const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = arguments.length;
          var VAR_2;
          switch (VAR_1) {
            case 0:
            case 1:
              VAR_2 = [];
              break;
            case 2:
              VAR_2 = [arguments[1]];
              break;
            default:
              VAR_2 = new Array(VAR_1 - 1);
              for (var VAR_3 = 1; VAR_3 < VAR_1; VAR_3++) {
                VAR_2[VAR_4] = arguments[VAR_3 - 1];
              }
              break;
          }
        }
        function FUNCTION_2() {
          var VAR_5 = Array.prototype.FUNCTION_2.call(arguments);
        }
        FUNCTION_1({ KEY_1: "data" });
    }
};
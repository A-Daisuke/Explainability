const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return (
            VAR_1 !== undefined && VAR_1 !== null && VAR_1.constructor === VAR_2
          );
        }
        function FUNCTION_3(VAR_8, VAR_9) {
          return typeof VAR_8 === VAR_9;
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          return VAR_3 instanceof VAR_4;
        }
        var VAR_5 = [];
        var VAR_6 = 5;
        var VAR_7 = {};
        FUNCTION_3(VAR_6, "number");
    }
};
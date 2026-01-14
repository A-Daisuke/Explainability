const Benchmark = {
    run: function() {
        var VAR_1, VAR_6;
        FUNCTION_1 = function (VAR_2) {
          VAR_1 = VAR_2;
          VAR_6 = 1000 / VAR_1;
        };
        function FUNCTION_2(VAR_4) {
          VAR_1 = VAR_2;
          VAR_6 = 1000 / VAR_1;
        }
        VAR_1 = 60;
        VAR_6 = 1000 / VAR_1;
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = this;
        var VAR_2 = {};
        function FUNCTION_1() {
          var VAR_3 = {};
          VAR_3.VAR_4 = 0;
          for (var VAR_5 = 0; VAR_5 < 10000; VAR_5++) {
            VAR_3.VAR_6 += VAR_5;
          }
          return VAR_3.VAR_4;
        }
        FUNCTION_1();
    }
};
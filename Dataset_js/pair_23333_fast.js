const Benchmark = {
    run: function() {
        var VAR_1 = 5;
        var VAR_2 = 0;
        var VAR_3 = new Array();
        function FUNCTION_1(VAR_4) {
          var VAR_5;
          var VAR_6 = new Array();
          VAR_3.push(0);
          VAR_3.push(1);
          for (VAR_5 = 0; VAR_5 < VAR_1; VAR_5++) {
            VAR_3.push(VAR_3[0] + VAR_3[1]);
            VAR_3.shift();
          }
          return VAR_3[0];
        }
    }
};
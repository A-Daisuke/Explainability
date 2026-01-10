const Benchmark = {
    run: function() {
        var VAR_1 = ["blah1", "blah2", "blah3", "blah4", "blah5"];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_4 = VAR_2.length;
          var VAR_6 = VAR_2[0];
          var VAR_5 = 1;
          if (VAR_3) {
            for (; VAR_5 < VAR_4; VAR_5++) {
              VAR_6 += VAR_3 + VAR_2[VAR_5];
            }
          } else {
            for (; VAR_5 < VAR_4; VAR_5++) {
              VAR_6 += VAR_2[VAR_5];
            }
          }
        }
        FUNCTION_1(VAR_1);
    }
};
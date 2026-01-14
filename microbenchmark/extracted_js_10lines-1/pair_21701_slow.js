const Benchmark = {
    run: function() {
        var VAR_1 = ["blah1", "blah2", "blah3", "blah4", "blah5"];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_4 = VAR_2.length;
          var VAR_5 = "";
          var VAR_6 = 0;
          if (VAR_3) {
            for (; VAR_6 < VAR_4; VAR_6++) {
              VAR_5 += VAR_3 + VAR_2[VAR_6];
            }
          } else {
            for (; VAR_6 < VAR_4; VAR_6++) {
              VAR_5 += VAR_2[VAR_6];
            }
          }
        }
        FUNCTION_1(VAR_1);
    }
};
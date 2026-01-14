const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = [];
          for (VAR_4 = 0; VAR_4 < VAR_1.length; ++VAR_4) {
            if (VAR_1.substring(VAR_4, VAR_4 + VAR_2.length) == VAR_2) {
              VAR_3.push(VAR_4);
            }
          }
          return VAR_3;
        }
        FUNCTION_1("I learned to play the Ukulele in Lebanon.", "le");
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.length,
            VAR_3 = -1,
            VAR_4 = false,
            VAR_5 = "",
            VAR_6;
          while (++VAR_3 < VAR_2) {
            VAR_6 = VAR_1[VAR_3];
            if (VAR_6 == "-") VAR_4 = true;
            else {
              VAR_5 += VAR_4 ? VAR_6.toUpperCase() : VAR_6;
              VAR_4 = false;
            }
          }
          return VAR_5;
        }
        FUNCTION_1("border-left-width");
    }
};
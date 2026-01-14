const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          let VAR_5 = 0;
          let VAR_6 = -1;
          let VAR_3 = [];
          while (VAR_5 != -1) {
            VAR_5 = VAR_1.indexOf(VAR_2, VAR_6 + 1);
            VAR_6 = VAR_5;
            if (VAR_5 != -1) {
              VAR_3.push(VAR_5);
            }
          }
          return VAR_3;
        }
        FUNCTION_1("I learned to play the Ukulele in Lebanon.", "le");
    }
};
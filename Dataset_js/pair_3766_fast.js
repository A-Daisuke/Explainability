const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          this.VAR_2 = VAR_1;
        }
        FUNCTION_1.prototype.KEY_1 = function () {
          console.FUNCTION_2(this.VAR_2);
        };
        function FUNCTION_5(VAR_8) {
          return {
            KEY_1: function () {
              console.FUNCTION_2(VAR_8);
            },
          };
        }
        function FUNCTION_6(VAR_9) {
          return FUNCTION_5("obj #" + VAR_9);
        }
        function FUNCTION_4(VAR_4, VAR_5) {
          var VAR_6 = [];
          var VAR_7;
          for (VAR_7 = 0; VAR_7 < VAR_5; VAR_7 += 1) {
            VAR_6.push(VAR_4(VAR_7));
          }
          return VAR_6;
        }
        FUNCTION_4(FUNCTION_6, 1000);
    }
};
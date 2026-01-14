const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          this.VAR_2 = VAR_1;
        }
        FUNCTION_1.prototype.FUNCTION_2 = function () {
          console.FUNCTION_2(this.VAR_2);
        };
        function FUNCTION_3(VAR_3) {
          return new FUNCTION_1("Obj #" + VAR_3);
        }
        function FUNCTION_4(VAR_4, VAR_5) {
          var VAR_6 = [];
          var VAR_7;
          for (VAR_7 = 0; VAR_7 < VAR_5; VAR_7 += 1) {
            VAR_6.push(VAR_4(VAR_7));
          }
          return VAR_6;
        }
        FUNCTION_4(FUNCTION_3, 1000);
    }
};
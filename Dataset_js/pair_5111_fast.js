const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          this.VAR_3 = VAR_1;
          this.VAR_4 = VAR_2;
        }
        function FUNCTION_2(VAR_5, VAR_6) {
          if (this instanceof FUNCTION_2) {
            this.VAR_3 = VAR_5;
            this.VAR_4 = VAR_6;
          } else {
            return new FUNCTION_2(VAR_5, VAR_6);
          }
        }
        function FUNCTION_3(VAR_7, VAR_8) {
          var VAR_9 = this instanceof FUNCTION_2 ? this : Object.create(FUNCTION_2.prototype);
          this.VAR_3 = VAR_7;
          this.VAR_4 = VAR_8;
        }
        var VAR_10 = FUNCTION_3(10, 10);
    }
};
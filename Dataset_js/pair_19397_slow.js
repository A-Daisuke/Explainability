const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          this.VAR_2 = VAR_1;
        }
        function FUNCTION_2(VAR_3) {
          this.VAR_4 = VAR_3;
        }
        function FUNCTION_3(VAR_5, VAR_6, VAR_7) {
          this.VAR_2 = VAR_5;
          this.VAR_4 = VAR_6;
          this.VAR_8 = VAR_7;
        }
        var VAR_9 = new Array(1);
        VAR_9[0] = 1;
        var VAR_10 = new Array(1);
        VAR_10[0] = "2";
        var VAR_11 = new Array(3);
        VAR_11[0] = VAR_9[0];
        VAR_11[1] = VAR_10[0];
        VAR_11[2] = true;
    }
};
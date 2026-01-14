const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6) {
          this.VAR_7 = VAR_1;
          this.VAR_8 = VAR_2;
          this.VAR_9 = VAR_3;
          this.VAR_10 = VAR_4;
          this.VAR_11 = VAR_5;
          this.VAR_12 = VAR_6;
        }
        for (var VAR_13 = 0; VAR_13 < 10000; VAR_13++) {
          var VAR_14 = new FUNCTION_1(VAR_13, VAR_13, VAR_13, VAR_13, VAR_13);
        }
    }
};
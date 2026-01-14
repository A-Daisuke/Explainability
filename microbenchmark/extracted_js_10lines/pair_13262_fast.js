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
        var VAR_12 = { KEY_1: 1 };
        var VAR_13 = { KEY_2: "2" };
        var VAR_14 = {
          KEY_3: VAR_12.VAR_2,
          KEY_4: VAR_13.VAR_4,
          KEY_5: true,
        };
    }
};
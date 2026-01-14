const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = "x2v1";
        }
        FUNCTION_1.VAR_2 = {
          KEY_1: "x2v2",
          KEY_2: function X2_x2m1() {
            return "x2m1";
          },
          KEY_3: function X2_x2m2() {
            return "x2m2";
          },
        };
    }
};
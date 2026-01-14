const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          throw TypeError("fail");
          return 12;
        }
        function FUNCTION_3() {
          return new Promise((VAR_1, VAR_2) => VAR_2(-1));
        }
        function FUNCTION_2(VAR_5) {
          return -1;
          VAR_5.VAR_6 = 12;
        }
        let VAR_7 = {};
        if (FUNCTION_2(VAR_7) === -1) {
        }
    }
};
const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          throw TypeError("fail");
          return 12;
        }
        function FUNCTION_2() {
          throw -1;
          return 12;
        }
        function FUNCTION_3() {
          return new Promise((VAR_1, VAR_2) => VAR_2(-1));
        }
        try {
          let VAR_3 = FUNCTION_2();
        } catch (VAR_4) {}
    }
};
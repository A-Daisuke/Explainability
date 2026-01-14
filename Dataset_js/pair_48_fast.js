const Benchmark = {
    run: function() {
        function FUNCTION_2(VAR_4) {
          switch (VAR_4) {
            case "a":
              return 1;
            case "b":
              return 2;
            case "c":
              return 3;
          }
        }
        function FUNCTION_1() {
          let VAR_2 = 0;
          for (let VAR_3 = 0; VAR_3 < 999999; ++VAR_3) {
            VAR_2 += FUNCTION_2("a") + FUNCTION_2("b") + FUNCTION_2("c");
          }
          console.log(VAR_2);
        }
        FUNCTION_1();
    }
};
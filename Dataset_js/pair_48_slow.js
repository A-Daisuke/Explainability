const Benchmark = {
    run: function() {
        const VAR_1 = new Map();
        VAR_1.set("a", 1);
        VAR_1.set("b", 2);
        VAR_1.set("c", 3);
        function FUNCTION_1() {
          let VAR_2 = 0;
          for (let VAR_3 = 0; VAR_3 < 999999; ++VAR_3) {
            VAR_2 += VAR_1.get("a") + VAR_1.get("b") + VAR_1.get("c");
          }
          console.log(VAR_2);
        }
        FUNCTION_1();
    }
};
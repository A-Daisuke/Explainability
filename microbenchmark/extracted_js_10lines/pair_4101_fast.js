const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return VAR_1 + VAR_2;
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          return VAR_3 + VAR_4;
        }
        function FUNCTION_3(VAR_5, VAR_6) {
          return VAR_5 + VAR_6;
        }
        function FUNCTION_4(VAR_7, VAR_8) {
          return VAR_7 + VAR_8;
        }
        for (var VAR_9 = 0; VAR_9 < 800; VAR_9 += 1) {
          var VAR_10 = Math.floor(Math.random() * 4) + 1;
          var VAR_11 = "myFunc" + VAR_10;
          if (typeof VAR_11 === "function") {
            setTimeout(VAR_11(3, 5), 0);
          }
        }
    }
};
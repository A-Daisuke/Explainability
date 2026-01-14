const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = [];
          for (var VAR_3 = 0; VAR_3 < VAR_1.length; VAR_3++) {
            var VAR_4 = 1;
            var VAR_5 = VAR_1[VAR_3];
            while (VAR_5 === VAR_1[VAR_3 + 1]) {
              VAR_4++;
              VAR_3++;
            }
            VAR_2.push(VAR_5);
            if (VAR_4 >= 1) {
              VAR_2.push(VAR_4);
            }
          }
          return VAR_2.join("");
        }
        FUNCTION_1("aabcccccaaa");
    }
};
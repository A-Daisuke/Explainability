const Benchmark = {
    run: function() {
        var VAR_1 = [
          "apple",
          "orange",
          "tomato",
          "ananas",
          "banana",
          "mango",
          "lemon",
          "tomato",
        ];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_7,
            VAR_4 = [];
          while (VAR_7 < VAR_2.length) {
            if (VAR_2[VAR_7] === VAR_3) {
              VAR_4.push(VAR_7);
            }
            VAR_7++;
          }
          return VAR_4;
        }
        FUNCTION_1(VAR_1, "tomato");
    }
};
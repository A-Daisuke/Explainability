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
          var VAR_4 = [];
          VAR_2.forEach(function (VAR_5, VAR_6) {
            if (VAR_5 === VAR_3) {
              VAR_4.push(VAR_6);
            }
            return VAR_4;
          });
        }
        FUNCTION_1(VAR_1, "tomato");
    }
};
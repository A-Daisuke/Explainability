const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (!VAR_1 || VAR_1.length === 0) {
            return VAR_1;
          }
          var VAR_6 = VAR_1[0],
            VAR_7 = [VAR_6],
            VAR_8 = VAR_1.length,
            VAR_9 = 1,
            VAR_10;
          for (var VAR_3 = 1; VAR_3 < VAR_8; VAR_3++) {
            var VAR_5 = VAR_1[VAR_3];
            if (VAR_5 === VAR_6) {
              VAR_9++;
            } else {
              VAR_7.push(VAR_9, VAR_5);
              VAR_9 = 1;
              VAR_6 = VAR_5;
            }
          }
          VAR_7.push(VAR_9);
          VAR_10 = VAR_7.join("");
          return VAR_10.length < VAR_1.length ? VAR_10 : VAR_1;
        }
        FUNCTION_1("aabcccccaaa");
    }
};
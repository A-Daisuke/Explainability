const Benchmark = {
    run: function() {
        let VAR_1 = "sarcasm casing";
        var FUNCTION_2 = (VAR_7) => {
          var VAR_3 = false;
          let VAR_8 = VAR_7.toUpperCase();
          let VAR_9 = VAR_7.toLowerCase();
          return [...Array(VAR_7.length)]
            .map((VAR_10, VAR_11) => (VAR_11 % 2 == 0 ? VAR_9[VAR_11] : VAR_8[VAR_11]))
            .join("");
        };
        FUNCTION_2(VAR_1);
    }
};
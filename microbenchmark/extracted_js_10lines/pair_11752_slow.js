const Benchmark = {
    run: function() {
        let VAR_1 = "sarcasm casing";
        let FUNCTION_1 = (VAR_2) => {
          var VAR_3 = false;
          return VAR_2
            .split("")
            .map((VAR_4, VAR_5) => {
              VAR_3 = !VAR_3 || VAR_4 == " ";
              return VAR_3 ? VAR_4.toLowerCase() : VAR_4.toUpperCase();
            })
            .join("");
        };
        let VAR_6 = FUNCTION_1(VAR_1);
    }
};
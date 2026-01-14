const Benchmark = {
    run: function() {
        const VAR_1 = "string1";
        const VAR_2 = "string2";
        const VAR_3 = "string3";
        const VAR_4 = "string4";
        const VAR_5 = "string5";
        const VAR_6 = [VAR_1, VAR_2, VAR_3, VAR_4, VAR_5];
        function FUNCTION_1(...VAR_7) {
          return VAR_7.join("_");
        }
        var VAR_8 = [VAR_1, VAR_2, VAR_3, VAR_4, VAR_5].join("_");
    }
};
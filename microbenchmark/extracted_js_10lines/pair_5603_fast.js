const Benchmark = {
    run: function() {
        var VAR_3 = {
          "&": "&#38;",
          "<": "&#60;",
          ">": "&#62;",
          '"': "&#34;",
          "'": "&#39;",
        };
        function FUNCTION_1(VAR_1) {
          return String(VAR_1 || "").replace(/[<>'"]|(?:&(?!\w+;))/g, function (VAR_4) {
            return VAR_3[VAR_4];
          });
        }
        function FUNCTION_2(VAR_2) {
          return String(VAR_2 || "")
            .replace(/&(?!\w+;)/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace(/"/g, "&#34;")
            .replace(/'/g, "&#39;");
        }
        FUNCTION_1();
        FUNCTION_1(null);
        FUNCTION_1("");
    }
};
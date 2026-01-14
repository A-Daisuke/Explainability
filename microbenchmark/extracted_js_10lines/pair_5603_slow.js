const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return String(VAR_1 || "")
            .replace(/&(?!\w+;)/g, "&#38;")
            .split("<")
            .join("&#60;")
            .split(">")
            .join("&#62;")
            .split('"')
            .join("&#34;")
            .split("'")
            .join("&#39;");
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
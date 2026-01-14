const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (!VAR_1.length) return VAR_2.length;
          if (!VAR_2.length) return VAR_1.length;
          return Math.min(
            FUNCTION_1(VAR_1.substr(1), VAR_2) + 1,
            FUNCTION_1(VAR_2.substr(1), VAR_1) + 1,
            FUNCTION_1(VAR_1.substr(1), VAR_2.substr(1)) + (VAR_1[0] !== VAR_2[0] ? 1 : 0),
          );
        }
        FUNCTION_1("maths", "math");
    }
};
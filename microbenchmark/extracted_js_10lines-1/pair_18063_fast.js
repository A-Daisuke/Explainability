const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2;
          try {
            return VAR_1
              ? VAR_1 == "true" ||
                  (VAR_1 == "false"
                    ? false
                    : VAR_1 == "null"
                      ? null
                      : !/^0/.test(VAR_1) && !isNaN((VAR_2 = Number(VAR_1)))
                        ? VAR_2
                        : /^[\[\{]/.test(VAR_1)
                          ? $.parseJSON(VAR_1)
                          : VAR_1)
              : VAR_1;
          } catch (VAR_3) {
            return VAR_1;
          }
        }
        FUNCTION_1(null);
    }
};
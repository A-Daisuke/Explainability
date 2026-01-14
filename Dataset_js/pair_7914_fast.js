const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.KEY_1.replace(/\D/g, "");
          VAR_1.KEY_1 =
            "(" +
            VAR_2.substr(0, 3) +
            ") " +
            VAR_2.substr(3, 3) +
            " - " +
            VAR_2.substr(6, 4);
        }
        var VAR_5 = { KEY_1: "(252)-665-1229" };
        FUNCTION_1(VAR_5);
    }
};
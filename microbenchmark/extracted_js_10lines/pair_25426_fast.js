const Benchmark = {
    run: function() {
        var VAR_1 = ["a", "b", "c", "d", "e", "f"],
          VAR_2 = VAR_1.VAR_2,
          FUNCTION_1 = function (VAR_3) {
            VAR_4 = VAR_3;
          },
          VAR_4,
          VAR_5;
        VAR_5 = 0;
        if (!FUNCTION_1) throw new TypeError("Bad Callback");
        while (VAR_5 < VAR_2) {
          if (VAR_5 in VAR_1) {
            FUNCTION_1.call(VAR_1, VAR_1[VAR_5], VAR_5, VAR_1);
          }
          VAR_5++;
        }
    }
};
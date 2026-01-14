const Benchmark = {
    run: function() {
        (function () {
          var VAR_1 = [];
          for (var VAR_2 = 0; VAR_2 < 7000; VAR_2++) {
            VAR_1[VAR_2++] = "Quick ";
            VAR_1[VAR_2++] = VAR_2;
            VAR_1[VAR_2++] = " fox ";
            VAR_1[VAR_2++] = VAR_2;
            VAR_1[VAR_2++] = " over the ";
            VAR_1[VAR_2++] = VAR_2;
            VAR_1[VAR_2++] = " dog. ";
          }
          VAR_1.join("");
        })();
    }
};
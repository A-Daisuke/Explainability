const Benchmark = {
    run: function() {
    var VAR_1 = [];
    for (var VAR_2 = 0; VAR_2 < 200; VAR_2++) {
      VAR_1.push("data_" + VAR_2 + "_" + VAR_2);
    }
    var VAR_3 = [];
    var VAR_4 = 0;
    for (var VAR_5 = 0; VAR_2 < 200; VAR_2++) {
      VAR_3.push([VAR_1[VAR_4], VAR_1[VAR_1.length - VAR_4]]);
      VAR_4++;
      if (VAR_4 > VAR_1.length) {
        VAR_4 = 0;
      }
    }
    var VAR_6 = VAR_3.slice();
    function FUNCTION_1(VAR_7, VAR_8) {
      if (VAR_7[0] < VAR_8[0]) return -1;
      if (VAR_7[0] > VAR_8[0]) return 1;
      return 0;
    }
    VAR_6.sort(FUNCTION_1);
    }
};

const Benchmark = {
    run: function() {
    var VAR_1 = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
    var VAR_2 = 0,
      VAR_3;
    for (var VAR_4 = 0, VAR_5 = VAR_1.length; VAR_4 < VAR_5; ++VAR_4) {
      VAR_6 = VAR_1[VAR_4];
      if (!isNaN(VAR_6)) {
        VAR_3 = parseFloat(VAR_6);
        if (!isNaN(VAR_3)) {
          VAR_2 += VAR_3;
        }
      }
    }
    }
};

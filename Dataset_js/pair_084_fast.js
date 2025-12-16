const Benchmark = {
    run: function() {
    var VAR_1 = {
      1: 1,
      2: 2,
      3: 3,
    };
    var VAR_2 = 0;
    for (var VAR_3 = 0; VAR_3 < 100; VAR_3++) {
      var VAR_4 = Number(VAR_3) in VAR_1;
      if (VAR_4) VAR_2 += 1;
    }
    }
};

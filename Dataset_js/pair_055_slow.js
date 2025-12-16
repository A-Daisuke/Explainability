const Benchmark = {
    run: function() {
    var VAR_1 = [
      "D_FOOBARFOOBAR1",
      "D_FOOBARFOOBAR2",
      "A_FOOBARFOOBAR1",
      "A_FOOBARFOOBAR2",
      "C_FOOBARFOOBAR1",
      "O_FOOBARFOOBAR1",
    ];
    var VAR_2;
    for (var VAR_3 = 0, VAR_4 = VAR_1.length; VAR_3 < VAR_4; ++VAR_3) {
      if (
        VAR_1[VAR_3][0] == "O" ||
        VAR_1[VAR_3][0] == "U" ||
        VAR_1[VAR_3][0] == "o" ||
        VAR_1[VAR_3][0] == "u"
      ) {
        ++VAR_2;
      }
    }
    }
};

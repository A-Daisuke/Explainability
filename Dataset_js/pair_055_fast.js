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
    var VAR_5 = new RegExp("^[ou]", "i");
    for (var VAR_3 = 0, VAR_4 = VAR_1.length; VAR_3 < VAR_4; ++VAR_3) {
      if (VAR_5.test(VAR_1[VAR_3])) {
        ++VAR_2;
      }
    }
    }
};

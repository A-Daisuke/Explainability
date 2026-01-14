const Benchmark = {
    run: function() {
        var VAR_1 = [
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "abcd",
          "",
          "abcd",
        ];
        var VAR_2 = /.+/;
        VAR_1.filter(function (VAR_3) {
          return VAR_2.test(VAR_3);
        });
    }
};
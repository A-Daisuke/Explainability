const Benchmark = {
    run: function() {
        var VAR_1 = ["a", "b", "c", "d", "e"];
        var VAR_2 = "";
        var VAR_3 = Math.random().toString();
        var VAR_4 = Math.random().toString();
        VAR_2 =
          VAR_3 +
          VAR_2 +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          "test" +
          VAR_3 +
          VAR_4;
    }
};
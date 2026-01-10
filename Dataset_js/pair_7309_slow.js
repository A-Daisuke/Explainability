const Benchmark = {
    run: function() {
        var VAR_1 = [
          "thing as val, key",
          "     thing   as  val ,  key ",
          "thing as val",
          "  thing    as  val   ",
          "thing",
          "     thing  ",
        ];
        VAR_1.forEach(function (VAR_2) {
          var VAR_3 = VAR_2.trim().split(/\s+as\s+/);
          if (VAR_3.length > 1) {
            VAR_3[1].split(/\s*,\s*/);
          }
        });
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = [
          "read",
          "write",
          "tickle",
          "join",
          "delete",
          "insert",
          "render",
          "publish",
          "copy",
          "jog",
          "madonna",
          "light",
        ];
        var VAR_2 = "publish";
        var VAR_3 = false;
        VAR_4 = VAR_1.length;
        for (var VAR_5 = 0; VAR_5 < VAR_4; VAR_5++) {
          if (VAR_1[VAR_5] === VAR_2) {
            VAR_3 = true;
            break;
          }
        }
        var VAR_6 = VAR_3;
    }
};
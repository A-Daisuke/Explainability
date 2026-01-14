const Benchmark = {
    run: function() {
        var VAR_1 = '<a href="http://ya.ru/x=1&y=2">';
        var VAR_2 = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quote;",
        };
        VAR_1.replace(/["<>&]/g, function (VAR_3) {
          switch (VAR_3) {
            case "<":
              return "&lt;";
            case ">":
              return "&gt;";
            case "&":
              return "&amp;";
            case '"':
              return "&quote;";
          }
        });
    }
};
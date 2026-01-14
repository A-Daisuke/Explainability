const Benchmark = {
    run: function() {
        var VAR_1 = '<a href="http://ya.ru/x=1&y=2">';
        var VAR_2 = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quote;",
        };
        VAR_1
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quote;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
    }
};
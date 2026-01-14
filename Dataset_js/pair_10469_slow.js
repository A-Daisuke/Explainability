const Benchmark = {
    run: function() {
        var VAR_1 = [
          {
            KEY_1: "foo.org",
            KEY_2: "bar.net",
          },
          {
            KEY_3: "baz.com",
            KEY_4: "quux.gov",
          },
        ];
        function FUNCTION_1(VAR_2) {
          var VAR_3 = [];
          for (var VAR_4 = 0; VAR_4 < VAR_2.length; VAR_4++) {
            VAR_3.push("<ul>");
            for (var VAR_5 in VAR_2[VAR_4]) {
              VAR_3.push('<li><a href="' + VAR_2[VAR_4][VAR_5] + '">' + VAR_5 + "</a></li>");
            }
            VAR_3.push("</ul>");
          }
          VAR_3.join("");
          return VAR_3;
        }
        FUNCTION_1(VAR_1);
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 =
          "/* <% name %> */\n" +
          "amaze.injection(function (window, document, require, amaze) {\n" +
          "<% code %>\n" +
          "}, {\n" +
          'priority:"<% order %>",name:"<% name %>",regex:<% regex %>,css:<% css %>\n' +
          "});\n";
        var VAR_2 = {
          KEY_1: "a name",
          KEY_2: "a code",
          KEY_3: "some order",
          KEY_4: "a regex",
          KEY_5: "some css",
        };
        var VAR_3 = VAR_1.replace(/<%\s*([a-z0-9])\s*%>/i, function (VAR_4, VAR_5) {
          return VAR_2[VAR_5];
        });
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = "1234567890abcdefghijklmon";
        var VAR_2 = "1234567890abcdefghijklmon";
        var VAR_3 = null;
        for (var VAR_4 = 0; VAR_4 < VAR_1.length; VAR_4++) {
          var VAR_5 = VAR_1.charCodeAt(VAR_4);
          switch (VAR_5) {
            case "A".charCodeAt(0):
              VAR_3 = VAR_5;
              break;
            case "a".charCodeAt(0):
              VAR_3 = VAR_5;
              break;
            case "b".charCodeAt(0):
              VAR_3 = VAR_5;
              break;
            case "c".charCodeAt(0):
              VAR_3 = VAR_5;
              break;
          }
        }
    }
};
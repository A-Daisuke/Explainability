const Benchmark = {
    run: function() {
        var VAR_1 = "1234567890abcdefghijklmon";
        var VAR_2 = "1234567890abcdefghijklmon";
        var VAR_3 = null;
        for (var VAR_4 = 0; VAR_4 < VAR_1.length; VAR_4++) {
          switch (VAR_1.charCodeAt(VAR_4)) {
            case 65:
              VAR_3 = 65;
              break;
            case 97:
              VAR_3 = 97;
              break;
            case 98:
              VAR_3 = 98;
              break;
            case 99:
              VAR_3 = 99;
              break;
          }
        }
    }
};
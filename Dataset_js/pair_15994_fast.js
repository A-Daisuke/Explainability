const Benchmark = {
    run: function() {
        var VAR_1 = "a",
          VAR_7 = "IsItValidTagName123",
          VAR_2 = /^[a-zA-Z0-9]+$/;
        function FUNCTION_1(VAR_3) {
          var VAR_4 = VAR_7.length;
          for (var VAR_5 = 0; VAR_5 < VAR_4; VAR_5++) {
            var VAR_6 = VAR_7.charCodeAt(VAR_5);
            if (
              !(VAR_6 >= 97 && VAR_6 <= 122) &&
              !(VAR_6 >= 65 && VAR_6 <= 90) &&
              !(VAR_6 >= 48 && VAR_6 <= 57)
            ) {
              return false;
            }
          }
          return true;
        }
        VAR_2.test(VAR_7);
    }
};
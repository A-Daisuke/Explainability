const Benchmark = {
    run: function() {
        var VAR_1 = "a",
          VAR_2 = /^[a-zA-Z0-9]+$/;
        function FUNCTION_1(VAR_3) {
          var VAR_4 = VAR_3.length;
          for (var VAR_5 = 0; VAR_5 < VAR_4; VAR_5++) {
            var VAR_6 = VAR_3.charCodeAt(VAR_5);
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
        VAR_2.test("a");
        VAR_2.test("b");
        VAR_2.test("3");
        VAR_2.test("d");
        VAR_2.test("E");
        VAR_2.test("G");
        VAR_2.test(4);
        VAR_2.test(5);
    }
};
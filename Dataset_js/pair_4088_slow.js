const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 =
            "var value; try { value = obj." + VAR_2 + ";} catch (e) { } return value;";
          var VAR_4 = new Function("obj", VAR_3);
          return VAR_4(VAR_1);
        }
        var VAR_5 = {
          KEY_1: [
            1,
            2,
            3,
            {
              KEY_2: {
                KEY_3: [4, 5],
              },
            },
          ],
        };
        FUNCTION_1(VAR_5, "a[3].d.c[1]");
    }
};
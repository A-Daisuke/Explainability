const Benchmark = {
    run: function() {
        var VAR_1 = [
          {
            KEY_1: "classe1",
            KEY_2: "text1",
          },
          {
            KEY_3: "classe2",
            KEY_4: "text2",
          },
          {
            KEY_5: "classe1",
            KEY_6: "text3",
          },
        ];
        function FUNCTION_1(VAR_2) {
          var VAR_3 = [];
          for (var VAR_4 = 0; VAR_4 < VAR_2.length; VAR_4++) {
            if (VAR_2[VAR_4].KEY_1 == "classe1") VAR_3.push(VAR_2[VAR_4]);
          }
          return VAR_3;
        }
        var VAR_5 = FUNCTION_1(VAR_1);
    }
};
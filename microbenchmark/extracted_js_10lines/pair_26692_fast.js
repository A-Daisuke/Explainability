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
          return VAR_2.KEY_1 == "classe1";
        }
        var VAR_5 = VAR_1.filter(FUNCTION_1);
    }
};
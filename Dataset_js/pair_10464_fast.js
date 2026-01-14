const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "one",
          KEY_2: "two",
          KEY_3: "three",
          KEY_4: "four",
          KEY_5: "five",
        };
        var VAR_2 = "";
        var VAR_3;
        VAR_2 = "";
        for (VAR_3 in VAR_1) {
          if (VAR_2 !== "") {
            VAR_2 += "&";
          }
          VAR_2 += VAR_3 + "=" + VAR_1[VAR_3];
        }
    }
};
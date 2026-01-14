const Benchmark = {
    run: function() {
        var VAR_1 = [
          "value1",
          "value2",
          "value3",
          "value4",
          "value5",
          "value6",
          "value7",
          "value8",
          "value9",
          "value10",
          "value11",
          "value12",
          "value13",
          "value14",
          "value15",
          "value16",
          "value17",
          "value18",
          "value19",
          "value20",
        ];
        var VAR_2 = ["value1", "value10", "value20"];
        for (var VAR_3 = 0, VAR_4 = VAR_2.length; VAR_3 < VAR_4; VAR_3++) {
          var VAR_5 = VAR_2[VAR_3];
          var VAR_6 = VAR_1.some((VAR_7) => VAR_7 === VAR_5);
        }
    }
};
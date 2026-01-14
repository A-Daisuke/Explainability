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
        for (var VAR_6 = 0, VAR_7 = VAR_1.length; VAR_6 < VAR_7; VAR_6++) {
          var VAR_8 = VAR_1[VAR_6];
          var VAR_9 = VAR_2.indexOf(VAR_8) !== -1;
        }
    }
};
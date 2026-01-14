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
        for (let VAR_3 of VAR_1) {
          let VAR_4 = false;
          for (let VAR_5 of VAR_2) {
            if (VAR_3 === VAR_5) {
              VAR_4 = true;
              break;
            }
          }
        }
    }
};
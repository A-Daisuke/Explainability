const Benchmark = {
    run: function() {
        var VAR_1 = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
          ],
          VAR_2 = 0;
        for (var VAR_3 in VAR_1) {
          var VAR_4 = parseInt(VAR_1[VAR_3]);
          if (VAR_4) VAR_2 += VAR_4;
        }
    }
};
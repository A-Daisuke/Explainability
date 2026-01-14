const Benchmark = {
    run: function() {
        VAR_1 = [
          "64",
          "65",
          "f6",
          "64",
          "19",
          "ff",
          "42",
          "72",
          "94",
          "58",
          "c8",
          "a6",
          "54",
          "d0",
          "2a",
          "97",
          "5f",
          "6c",
          "9a",
          "33",
          "57",
          "e2",
          "62",
          "60",
          "e1",
          "74",
          "fe",
          "cb",
          "1f",
          "8a",
          "40",
          "87",
        ];
        VAR_1.forEach(function (VAR_2) {
          var VAR_3 = String.fromCharCode(Number.parseInt(VAR_2, 16));
        });
    }
};
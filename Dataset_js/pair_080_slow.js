const Benchmark = {
    run: function() {
    var VAR_1 = [
      {
        KEY_1: "Joe",
        KEY_2: 17,
      },
      {
        KEY_3: "Bob",
        KEY_4: 17,
      },
      {
        KEY_5: "Carl",
        KEY_6: 35,
      },
    ];
    var VAR_2 = {};
    var VAR_3 = [];
    for (var VAR_4 in VAR_1) {
      if (typeof VAR_2[VAR_1[VAR_4].KEY_2] == "undefined") {
        VAR_3.push(VAR_1[VAR_4].KEY_2);
      }
      VAR_2[VAR_1[VAR_4].KEY_2] = 0;
    }
    }
};

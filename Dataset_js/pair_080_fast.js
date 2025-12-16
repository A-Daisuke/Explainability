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
    var VAR_5 = VAR_1.map(function (VAR_6) {
      return VAR_6.KEY_2;
    });
    VAR_5 = VAR_5.filter(function (VAR_7, VAR_8) {
      return VAR_5.indexOf(VAR_7) == VAR_8;
    });
    }
};

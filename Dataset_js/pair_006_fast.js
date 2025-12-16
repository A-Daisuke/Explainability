const Benchmark = {
    run: function() {
    var VAR_1 = [
      {
        KEY_1: "Nome 1",
        KEY_2: "25",
      },
      {
        KEY_3: "Nome 2",
        KEY_4: "23",
      },
    ];
    function FUNCTION_1(VAR_4, VAR_5) {
      for (var VAR_6 = 0; VAR_6 < VAR_4.length; VAR_6++) VAR_5.apply(VAR_4[VAR_6]);
    }
    FUNCTION_1(VAR_1, function () {
      var VAR_7 = "Nome: " + this.KEY_1 + " - Idade: " + this.KEY_2;
    });
    }
};

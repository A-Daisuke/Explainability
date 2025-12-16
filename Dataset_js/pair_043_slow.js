const Benchmark = {
    run: function() {
    var VAR_1 = "",
      VAR_2 = "A very simple string",
      VAR_3 = 10,
      VAR_4 = ["An array of strings", "Two of them"],
      VAR_5 = {
        KEY_1: "value",
        KEY_2: "other value",
      };
    VAR_1 + VAR_2;
    VAR_1 + VAR_3;
    VAR_1 + VAR_4;
    VAR_1 + VAR_5;
    }
};

const Benchmark = {
    run: function() {
        var VAR_1 = [
          "Banana",
          "Orange",
          "Apple",
          "Mango",
          "Peach",
          "Lemon",
          "Pineapple",
          "Plum",
          "Carrot",
        ];
        var VAR_3 = " " + VAR_1.join(" ") + " ";
        var VAR_4 = VAR_3.indexOf(" Plum ");
    }
};
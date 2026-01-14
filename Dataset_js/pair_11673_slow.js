const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [
          "Luke",
          "Obi-Wan",
          "Leia",
          "Han",
          "C3PO",
          "R2D2",
          "Biggs",
          "Wedge",
        ];
        for (var VAR_3 = 0, VAR_4 = VAR_2.length; VAR_3 < VAR_4; VAR_3++) {
          VAR_1.push(VAR_2[VAR_3]);
        }
    }
};
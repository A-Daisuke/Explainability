const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 100; VAR_2++)
          VAR_1.push(
            "howdy",
            "partner",
            "how",
            "goes",
            "it",
            "?",
            "it",
            "goes",
            "well",
            "here",
          );
        VAR_1 = VAR_1.join("");
    }
};
const Benchmark = {
    run: function() {
    var VAR_1 = ["a", "b", "c", "d"],
      VAR_8 = [],
      VAR_9 = VAR_1.length;
    for (i in VAR_1) {
      for (var VAR_10 = i; VAR_10 < VAR_9; VAR_10++) {
        if (VAR_1[i] != VAR_1[VAR_10]) {
          VAR_8.push(VAR_1[i] + " - " + VAR_1[VAR_10]);
        }
      }
    }
    }
};

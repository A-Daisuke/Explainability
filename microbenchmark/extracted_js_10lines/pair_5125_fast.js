const Benchmark = {
    run: function() {
        var VAR_1 = [
            "jack",
            "jill",
            "nancy",
            "tom",
            "cartman",
            "jack",
            "jill",
            "nancy",
            "tom",
            "cartman",
          ],
          VAR_2 = [3, 1, 4, 0, 2, 6, 5, 8, 9, 7];
        VAR_6 = [];
        VAR_2.forEach(function (VAR_5) {
          VAR_6.push(VAR_1[VAR_5]);
        });
    }
};
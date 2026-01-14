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
        VAR_3 = VAR_2.reduce(function (VAR_4, VAR_5) {
          return VAR_4.concat([VAR_1[VAR_5]]);
        }, []);
    }
};
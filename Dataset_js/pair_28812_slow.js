const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 5,
          KEY_2: function (VAR_2) {
            return VAR_2 + this.KEY_1;
          },
        };
        var VAR_3 = "erect";
        var VAR_4 = new Function(
          "array, transform",
          "return array.map(transform." + VAR_3 + ", transform)",
        );
        var VAR_5 = [];
        for (var VAR_6 = 0; VAR_6 < 50; VAR_6++) {
          VAR_5.push(VAR_6);
        }
        VAR_7 = Array(VAR_5.KEY_1);
        for (var VAR_8 = 0; VAR_6 < VAR_5.KEY_1; VAR_6++) {
          VAR_7[VAR_9] = VAR_1.KEY_2(VAR_5[VAR_6]);
        }
    }
};
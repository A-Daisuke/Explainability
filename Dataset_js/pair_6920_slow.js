const Benchmark = {
    run: function() {
        (function () {
          var VAR_1 = arguments.length,
            VAR_2 = [];
          for (var VAR_3 = 0; VAR_3 < VAR_1; VAR_3++) VAR_2.push(arguments[VAR_3]);
        })(
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          0,
        );
    }
};
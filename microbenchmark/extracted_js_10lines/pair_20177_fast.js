const Benchmark = {
    run: function() {
        const FUNCTION_1 = (VAR_1, VAR_2) => {
          for (var VAR_6 = 0; VAR_6 < VAR_2.length; VAR_6++) {
            var VAR_7 = VAR_2[VAR_6];
            if (VAR_7.KEY_1 === VAR_1) {
              return VAR_7.KEY_2;
            }
          }
        };
        var VAR_5 = [
          {
            KEY_1: 1,
            KEY_2: 213,
          },
          {
            KEY_3: 2,
            KEY_4: 123,
          },
          {
            KEY_5: 3,
            KEY_6: 456,
          },
        ];
        FUNCTION_1(3, VAR_5);
        FUNCTION_1(1, VAR_5);
        FUNCTION_1(2, VAR_5);
    }
};
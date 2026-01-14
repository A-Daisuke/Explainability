const Benchmark = {
    run: function() {
        const FUNCTION_1 = (VAR_1, VAR_2) => {
          var VAR_3 = VAR_2.find(function (VAR_4) {
            return VAR_4.KEY_1 === VAR_1;
          });
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
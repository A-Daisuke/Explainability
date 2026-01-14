const Benchmark = {
    run: function() {
        var VAR_1 = 11;
        var VAR_2 = "Hello World!";
        var VAR_3, VAR_4;
        var VAR_5 = Object.create(
          {},
          {
            KEY_1: {
              KEY_2: function () {
                return VAR_2;
              },
              KEY_3: function (VAR_6) {
                VAR_2 = VAR_6;
              },
            },
            KEY_4: {
              KEY_5: function () {
                return VAR_1;
              },
              KEY_6: function (VAR_7) {
                VAR_1 = VAR_7;
              },
            },
          },
        );
        VAR_3 = VAR_5.KEY_4;
        VAR_5.KEY_4 = 100;
        VAR_3 = VAR_5.KEY_4;
        VAR_4 = VAR_5.KEY_1;
        VAR_5.KEY_1 = "Welcome to JavaScript!";
        VAR_4 = VAR_5.KEY_1;
    }
};
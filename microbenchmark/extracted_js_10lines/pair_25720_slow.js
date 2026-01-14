const Benchmark = {
    run: function() {
        var VAR_1 = 0;
        ({
          KEY_1: function () {
            VAR_1++;
          },
          KEY_2: function () {
            VAR_1++;
          },
          KEY_3: function () {
            VAR_1++;
          },
        });
    }
};
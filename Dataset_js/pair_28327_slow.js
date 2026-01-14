const Benchmark = {
    run: function() {
        var VAR_1 = 0;
        var VAR_2 = [
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
          function () {
            VAR_1 += 10;
          },
        ];
        while (VAR_2.length) {
          VAR_2.shift().call();
        }
    }
};
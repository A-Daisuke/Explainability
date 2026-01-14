const Benchmark = {
    run: function() {
        var VAR_1 = 3,
          VAR_2 = VAR_1 * 256 * 64,
          VAR_3 = [],
          VAR_4 = [];
        while (VAR_2--) {
          VAR_3.push(VAR_2);
          VAR_4.push(VAR_2.toString(13));
        }
        (function () {
          var VAR_5 = [],
            VAR_6 = 0,
            VAR_7 = VAR_3.length;
          while (VAR_6 < VAR_7) {
            VAR_5.push.apply(VAR_5, VAR_3.slice(VAR_6, VAR_6 + VAR_1));
            VAR_5.push.apply(VAR_5, VAR_4.slice(VAR_6, (VAR_6 += VAR_1)));
          }
        })();
    }
};
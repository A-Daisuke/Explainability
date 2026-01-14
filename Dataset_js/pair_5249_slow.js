const Benchmark = {
    run: function() {
        var VAR_1 = Array(1000),
          VAR_2 = { KEY_1: 1 };
        Array.prototype.FUNCTION_1 = function (VAR_3, VAR_4) {
          var VAR_5 = [],
            VAR_6 = this;
          if (VAR_4 == undefined) {
            VAR_4 = this;
          }
          for (var VAR_7 in VAR_6) {
            if (VAR_7 == parseInt(VAR_7)) {
              VAR_5.push(VAR_3.call(VAR_4, VAR_6[VAR_7], VAR_7, VAR_6));
            }
          }
          return VAR_5;
        };
        VAR_1.map(function (VAR_8, VAR_9, VAR_10) {
          return VAR_8 + VAR_7 + VAR_6.length + this.KEY_1;
        }, VAR_2);
    }
};
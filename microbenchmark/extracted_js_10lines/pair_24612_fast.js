const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3];
        var VAR_2, VAR_3, VAR_4;
        var VAR_5 = 4;
        var VAR_6 = 8;
        var VAR_7 = [5, 6, 7, 8];
        Object.FUNCTION_1 = function (VAR_8) {
          if (typeof VAR_8 !== "object") return VAR_8;
          var VAR_9 = VAR_8 instanceof Array ? [] : {};
          for (VAR_10 in VAR_8) {
            if (VAR_8[VAR_10] && typeof VAR_8[VAR_10] == "object") VAR_9[VAR_10] = Object.clone(VAR_8[VAR_10]);
            else VAR_9[VAR_11] = VAR_8[VAR_10];
          }
          return VAR_9;
        };
        var VAR_12 = VAR_1.concat();
    }
};
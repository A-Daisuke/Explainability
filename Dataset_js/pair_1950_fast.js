const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          VAR_1 += "";
          VAR_2 += "";
          if (VAR_2.length <= 0) return VAR_1.length + 1;
          var VAR_4 = 0,
            VAR_5 = 0;
          var VAR_6 = VAR_3 ? 1 : VAR_2.length;
          while (true) {
            VAR_5 = VAR_1.indexOf(VAR_2, VAR_5);
            if (VAR_5 >= 0) {
              VAR_4++;
              VAR_5 += VAR_6;
            } else break;
          }
          return VAR_4;
        }
        var VAR_7 = new Array(10000).join(encodeURI("hello龜"));
        var VAR_8 = VAR_7.length - 2 * VAR_7.match(/%/g).length;
    }
};
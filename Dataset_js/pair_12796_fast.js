const Benchmark = {
    run: function() {
        var VAR_1 = Math.floor(Math.random() * 6 + 1),
          VAR_2 = Math.floor(Math.random().toFixed(VAR_1) * Math.pow(10, VAR_1));
        function FUNCTION_1(VAR_3, VAR_4) {
          VAR_3 = VAR_3 + "";
          if (VAR_3.length < VAR_4) {
            return FUNCTION_1("0" + VAR_3, VAR_4);
          }
          return VAR_3;
        }
        function FUNCTION_2(VAR_5, VAR_6) {
          return (VAR_6 + VAR_5).slice(-VAR_6.length);
        }
        function FUNCTION_3(VAR_7, VAR_8, VAR_9) {
          return (VAR_8 + VAR_7).substr(-6);
        }
        FUNCTION_2(VAR_2, "000000");
    }
};
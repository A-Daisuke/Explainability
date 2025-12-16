const Benchmark = {
    run: function() {
    function FUNCTION_1() {
      var VAR_1 = "0";
      var VAR_2 = [];
      for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
        var VAR_6 = VAR_1.lastIndexOf(",") + 1;
        var VAR_7;
        if (VAR_6 > 0 && VAR_6 < VAR_1.length) {
          VAR_7 = VAR_1.substring(VAR_6, VAR_1.length);
        } else {
          VAR_7 = VAR_1;
        }
        VAR_1 += "," + VAR_3;
        VAR_2.push(VAR_7);
      }
    }
    FUNCTION_1();
    }
};

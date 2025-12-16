const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1, VAR_2) {
      this.VAR_3 = VAR_1;
      this.VAR_4 = VAR_2;
    }
    FUNCTION_1.VAR_5 = new Object();
    (function (VAR_6, VAR_7) {
      var VAR_8 = 0;
      for (var VAR_9 = 0; VAR_9 < 1000; ++VAR_9) {
        for (var VAR_10 = 0; VAR_10 < VAR_6; ++VAR_10) {
          if (VAR_7[0].VAR_3 != VAR_10) {
            VAR_7[0].VAR_3 -= VAR_7[1].VAR_3;
            VAR_7[0].VAR_4 -= VAR_7[1].VAR_4;
          }
        }
      }
    })(100, [new FUNCTION_1(10, 10), new FUNCTION_1(1, 1)]);
    }
};

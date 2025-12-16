const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1, VAR_2) {
      this.VAR_3 = VAR_1;
      this.VAR_4 = VAR_2;
    }
    (function () {
      var VAR_5 = 0;
      var VAR_6 = [];
      while (VAR_5++ < 5000) {
        var VAR_7 = new FUNCTION_1(VAR_5, VAR_5);
        VAR_6.push(VAR_7);
      }
      if (VAR_6.length != 5000) throw new Error();
    })();
    }
};

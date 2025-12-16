const Benchmark = {
    run: function() {
    var VAR_1 = 10000;
    function FUNCTION_1(VAR_2, VAR_3) {
      if (VAR_2 !== VAR_3) {
        throw new Error(`Not equals, actual:'${VAR_2}', expected '${VAR_3}'.`);
      }
    }
    function FUNCTION_2() {
      this.VAR_4 = 0;
    }
    FUNCTION_2.prototype.FUNCTION_3 = function () {
      this.VAR_4 += 1;
    };
    var VAR_5 = new FUNCTION_2();
    for (var VAR_6 = 0; VAR_6 < VAR_1; VAR_6 += 1) {
      VAR_5.FUNCTION_3();
    }
    FUNCTION_1(VAR_5.VAR_4, VAR_1);
    }
};

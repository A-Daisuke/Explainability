const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = 1;
        }
        function FUNCTION_2() {}
        var VAR_2 = [],
          VAR_3 = [];
        var VAR_4;
        for (var VAR_5 = 0; VAR_5 < 1000; VAR_5++) {
          VAR_2.push(new FUNCTION_1());
          VAR_3.push(new FUNCTION_2());
        }
        for (var VAR_6 = 0; VAR_5 < 1000; ++VAR_5) {
          var VAR_7 = VAR_3[VAR_5];
          VAR_4 = VAR_7.VAR_1 === 1;
        }
    }
};
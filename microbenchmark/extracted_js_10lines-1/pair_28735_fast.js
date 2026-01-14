const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = 10;
        }
        function FUNCTION_2() {
          this.VAR_2 = 20;
        }
        var VAR_3 = [];
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_5 < 1000; VAR_5++) {
          VAR_3.push(new FUNCTION_1());
          VAR_4.push(new FUNCTION_2());
        }
        var VAR_6 = 0;
        for (var VAR_7 = 0; VAR_5 < 1000; VAR_5++) {
          if (VAR_3[VAR_5].constructor == VAR_4[VAR_5].constructor) VAR_6++;
        }
    }
};
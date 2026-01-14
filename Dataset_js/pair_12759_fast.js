const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 4, 5, 6, 7];
        function FUNCTION_1() {
          VAR_1.splice(2, 0, 3.5);
          return VAR_1;
        }
        function FUNCTION_2() {
          VAR_1.push(8);
          return VAR_1;
        }
        function FUNCTION_3() {
          VAR_1.unshift(0);
          return VAR_1;
        }
        function FUNCTION_4() {
          VAR_1[VAR_1.VAR_2] = 8;
          return VAR_1;
        }
        function FUNCTION_5() {
          return [0].concat(VAR_1);
        }
        FUNCTION_4();
    }
};
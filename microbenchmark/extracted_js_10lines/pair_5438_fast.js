const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          let VAR_2 = [];
          VAR_2.push(1);
          VAR_2.push(2);
          VAR_2.push(3);
          VAR_2.push(4);
          VAR_2.push(5);
          VAR_2.push(6);
          VAR_2.push(7);
          VAR_2.push(8);
          VAR_2.push(9);
          VAR_2.push(10);
          return VAR_2;
        }
        const VAR_3 = FUNCTION_1();
    }
};
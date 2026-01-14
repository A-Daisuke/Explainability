const Benchmark = {
    run: function() {
        var VAR_1 = {};
        function FUNCTION_1(VAR_2) {
          VAR_2(VAR_1);
        }
        function FUNCTION_2(VAR_3) {
          return this === VAR_1;
        }
        var VAR_5 = FUNCTION_2.bind(VAR_1);
        var VAR_4 = FUNCTION_2.bind(VAR_1).bind({}).bind({});
        FUNCTION_1(VAR_5);
    }
};
const Benchmark = {
    run: function() {
        var VAR_1,
          VAR_2,
          VAR_3,
          VAR_5,
          VAR_6,
          VAR_7;
        VAR_1 = "test";
        VAR_2 = "test2";
        String.prototype.FUNCTION_1 = function () {
          return this;
        };
        VAR_5 = VAR_2.FUNCTION_1();
        VAR_6 = new String("test");
        VAR_7 = new String("test2");
        VAR_3 = VAR_1 + VAR_5;
    }
};
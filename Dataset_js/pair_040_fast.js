const Benchmark = {
    run: function() {
    function FUNCTION_1() {
      for (var VAR_5 in this) return VAR_5;
      return undefined;
    }
    var VAR_1 = {};
    var VAR_2 = {
      KEY_1: 1,
      KEY_2: 2,
    };
    var VAR_3 = [];
    var VAR_4 = FUNCTION_1(VAR_1);
    }
};

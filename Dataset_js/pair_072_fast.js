const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      return Object.keys(VAR_1).map(function (VAR_4, VAR_5) {
        return [VAR_5, VAR_4];
      });
    }
    FUNCTION_1({
      KEY_1: 1,
      KEY_2: 1,
      KEY_3: 1,
      KEY_4: 1,
      KEY_5: 1,
      KEY_6: 1,
      KEY_7: 1,
      KEY_8: 1,
      KEY_9: 1,
      KEY_10: 1,
    });
    }
};

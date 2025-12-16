const Benchmark = {
    run: function() {
    var VAR_1 = Object.prototype.hasOwnProperty;
    var VAR_2 = {
      KEY_1: 1,
      KEY_2: 1,
      KEY_3: 1,
      KEY_4: 1,
      KEY_5: 1,
    };
    var VAR_3 = undefined;
    var VAR_4;
    if ("x" in VAR_2) {
      VAR_4 = 1;
    } else {
      VAR_4 = 2;
    }
    }
};

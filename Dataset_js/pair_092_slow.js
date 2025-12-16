const Benchmark = {
    run: function() {
    var VAR_1 = {};
    VAR_1.VAR_2 = {};
    VAR_1.VAR_2.VAR_3 = {};
    VAR_1.VAR_2.VAR_3.VAR_4 = {
      KEY_1: 1,
      KEY_2: 2,
      KEY_3: 3,
      KEY_4: 4,
      KEY_5: 5,
    };
    VAR_1.VAR_2.VAR_3.VAR_4.KEY_1;
    VAR_1.VAR_2.VAR_3.VAR_4.KEY_2;
    VAR_1.VAR_2.VAR_3.VAR_4.KEY_3;
    VAR_1.VAR_2.VAR_3.VAR_4.KEY_4;
    VAR_1.VAR_2.VAR_3.VAR_4.KEY_5;
    }
};

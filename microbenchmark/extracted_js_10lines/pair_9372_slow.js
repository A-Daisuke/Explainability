const Benchmark = {
    run: function() {
        VAR_1 = { KEY_1: 3 };
        VAR_2 = {
          KEY_2: 1,
          KEY_3: 2,
          KEY_4: function () {
            return this.KEY_1 + this.KEY_3;
          },
        };
        VAR_3 = Object.create(VAR_2);
        VAR_1.VAR_4 = VAR_2;
        VAR_3.KEY_4();
    }
};
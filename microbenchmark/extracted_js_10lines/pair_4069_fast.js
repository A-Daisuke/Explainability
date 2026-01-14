const Benchmark = {
    run: function() {
        (function () {
          var VAR_6 = {
            KEY_1: false,
            KEY_2: false,
            KEY_3: function () {
              this.KEY_1 = true;
              console.log("Your car is driving...");
            },
            KEY_4: function () {
              this.KEY_2 = true;
              console.log("Your car is honking...");
            },
          };
          var VAR_7 = VAR_6;
          VAR_7.KEY_4();
          VAR_7.KEY_3();
        })();
    }
};
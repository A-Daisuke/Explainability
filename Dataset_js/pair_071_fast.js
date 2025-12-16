const Benchmark = {
    run: function() {
    VAR_1 = "";
    var VAR_8 = {
      KEY_1: function (VAR_9, VAR_10) {
        this.VAR_4 = VAR_9;
        this.VAR_5 = VAR_10;
      },
      KEY_2: function () {
        VAR_6 = this.VAR_4 + " says: " + this.VAR_5 + "!";
      },
    };
    var VAR_11 = Object.create(VAR_8);
    VAR_11.KEY_1("Kitty", "Meow");
    VAR_11.KEY_2();
    }
};

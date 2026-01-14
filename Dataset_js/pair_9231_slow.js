const Benchmark = {
    run: function() {
        VAR_1 = "";
        function FUNCTION_1(VAR_2, VAR_3) {
          this.VAR_4 = VAR_2;
          this.VAR_5 = VAR_3;
        }
        FUNCTION_1.prototype.FUNCTION_2 = function () {
          VAR_6 = this.VAR_4 + " says: " + this.VAR_5 + "!";
        };
        var VAR_7 = new FUNCTION_1("Kitty", "Meow");
        VAR_7.FUNCTION_2();
    }
};
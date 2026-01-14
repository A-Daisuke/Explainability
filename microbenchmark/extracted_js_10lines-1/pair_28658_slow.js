const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          throw new Error("nope");
        }
        var VAR_1 = {
          KEY_1: FUNCTION_1,
          KEY_2: FUNCTION_1,
          KEY_3: FUNCTION_1,
        };
        new (function Dummy(VAR_2) {
          this.VAR_3 = "wont be foo";
          this.VAR_4 = [];
          this.VAR_5 = false;
          Object.freeze(this);
        })({
          KEY_4: "will be foo",
          KEY_5: true,
        });
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "string",
          KEY_2: 1,
          KEY_3: function () {},
          KEY_4: {},
          KEY_5: true,
        };
        function FUNCTION_1(VAR_2) {
          var VAR_3 = Object.prototype.toString.call(VAR_2);
          return VAR_3.slice(8, VAR_3.length - 1);
        }
        for (v in VAR_1) {
          FUNCTION_1(v);
        }
    }
};
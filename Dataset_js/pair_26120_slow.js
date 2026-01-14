const Benchmark = {
    run: function() {
        var VAR_1 = {};
        var VAR_2 = {
          KEY_1: 1,
          KEY_2: false,
          KEY_3: null,
          KEY_4: undefined,
          KEY_5: "string",
          KEY_6: {},
          KEY_7: [],
        };
        function FUNCTION_1(VAR_3) {
          return Object.keys(VAR_3).length;
        }
        FUNCTION_1(VAR_2);
    }
};
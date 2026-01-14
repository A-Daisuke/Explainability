const Benchmark = {
    run: function() {
        var VAR_1 = new Date();
        var VAR_2 = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
        function FUNCTION_1(VAR_3) {
          var VAR_4 = VAR_1.toISOString().match(VAR_2);
          return {
            KEY_1: VAR_4[1],
            KEY_2: VAR_4[2],
            KEY_3: VAR_4[3],
            KEY_4: VAR_4[4],
            KEY_5: VAR_4[5],
            KEY_6: VAR_4[6],
            KEY_7: VAR_4[7],
          };
        }
        FUNCTION_1(VAR_1);
    }
};
const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "hola",
          KEY_2: "nananana",
          KEY_3: {
            KEY_4: "appToken",
            KEY_5: "app",
            KEY_6: "new",
            KEY_7: "channelID",
            KEY_8: "version",
          },
        };
        var VAR_2 = VAR_1.KEY_3;
        var VAR_3 = {};
        if (VAR_2.KEY_7) {
          VAR_3.VAR_4 = VAR_2.KEY_7;
        }
        if (VAR_2.KEY_8) {
          VAR_3.VAR_5 = VAR_2.KEY_8;
        }
        var VAR_6 = {
          KEY_9: "notification",
          KEY_10: [VAR_3],
        };
    }
};
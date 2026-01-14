const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: {
            KEY_2: "level1",
            KEY_3: {
              KEY_4: "level2",
              KEY_5: {
                KEY_6: "level3",
                KEY_7: {
                  KEY_8: "level4",
                  KEY_9: {
                    KEY_10: "level5",
                    KEY_11: { KEY_12: "level6" },
                  },
                },
              },
            },
          },
        };
        var VAR_2 = VAR_1.KEY_1.KEY_3.KEY_2;
    }
};
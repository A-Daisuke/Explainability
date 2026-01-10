const Benchmark = {
    run: function() {
        let VAR_1 = [
          { KEY_1: 1 },
          { KEY_2: 2 },
          { KEY_3: 3 },
          { KEY_4: 4 },
          { KEY_5: 5 },
          { KEY_6: 6 },
          { KEY_7: 7 },
          { KEY_8: 8 },
          { KEY_9: 9 },
        ];
        let VAR_2 = [
          { KEY_10: 1 },
          { KEY_11: 2 },
          { KEY_12: 3 },
          { KEY_13: 4 },
          { KEY_14: 5 },
          { KEY_15: 6 },
          { KEY_16: 7 },
          { KEY_17: 8 },
          { KEY_18: 9 },
        ];
        VAR_3 = [...VAR_1, ...VAR_2];
    }
};
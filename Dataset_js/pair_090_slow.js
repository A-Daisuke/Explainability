for (var VAR_1 = 0; VAR_1 < 1000; VAR_1++) {
  var VAR_2 = {
    KEY_1: 0,
    KEY_2: 0,
    KEY_3: {
      KEY_4: "h",
      KEY_5: "a",
      KEY_6: "c",
      KEY_7: {
        KEY_8: 10,
        KEY_9: 20,
      },
    },
  };
  VAR_2.KEY_1;
  var VAR_3 = VAR_2.KEY_3;
  var VAR_4 = VAR_3.KEY_4 + "ola";
  var VAR_5 = VAR_3.KEY_5 + "zada";
  VAR_3.KEY_7.KEY_8 = VAR_3.KEY_7.KEY_8 + 1;
  VAR_3.KEY_7.KEY_9 = VAR_3.KEY_7.KEY_9 + 1;
}

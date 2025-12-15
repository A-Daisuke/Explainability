var VAR_1 = {
    KEY_1: "value",
    KEY_2: "value2",
    KEY_3: "value3",
  },
  VAR_2 = "key",
  VAR_3 = "key2",
  VAR_4 = "key3",
  VAR_5 = "key4";
Object.keys(VAR_1).indexOf("key") !== -1 &&
  Object.keys(VAR_1).indexOf("key2") !== -1 &&
  Object.keys(VAR_1).indexOf("key3") !== -1 &&
  Object.keys(VAR_1).indexOf("key4") !== -1;

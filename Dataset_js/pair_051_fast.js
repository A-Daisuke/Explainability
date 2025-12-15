VAR_1 = {
  KEY_1: {
    KEY_2: function () {
      return 2 + 2;
    },
    KEY_3: "string",
  },
};
if (VAR_1.KEY_1 && VAR_1.KEY_1.KEY_2 && typeof VAR_1.KEY_1.KEY_3 == "function")
  VAR_1.KEY_1.KEY_2();

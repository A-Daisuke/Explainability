var VAR_1 = {
  KEY_1: function () {
    return this.KEY_2;
  },
  KEY_2: {
    KEY_3: "sdasfasfasdfasdf",
    KEY_4: "sdasfasfasdfasdf",
    KEY_5: "sdasfasfasdfasdf",
  },
  KEY_6: function () {
    return this.KEY_2.KEY_3;
  },
  KEY_7: function () {
    return this.KEY_2.KEY_4;
  },
  KEY_8: function () {
    return this.KEY_2.KEY_5;
  },
};
var VAR_2 = {};
VAR_2.KEY_3 = VAR_1.KEY_2.KEY_3;
VAR_2.KEY_4 = VAR_1.KEY_2.KEY_4;
VAR_2.KEY_5 = VAR_1.KEY_2.KEY_5;

var VAR_1 = /[a-z]/gi;
VAR_2 = {
  KEY_1: function () {
    return "1";
  },
  KEY_2: function () {
    return "2";
  },
  KEY_3: function () {
    return "3";
  },
  KEY_4: function () {
    return "4";
  },
  KEY_5: function () {
    return "5";
  },
  KEY_6: function () {
    return "6";
  },
  KEY_7: function () {
    return "7";
  },
};
function FUNCTION_1(VAR_3) {
  return VAR_2[VAR_3] ? VAR_2[VAR_3]() : VAR_3;
}
"abcdefg".replace(VAR_1, FUNCTION_1);

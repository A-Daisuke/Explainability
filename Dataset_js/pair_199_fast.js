var VAR_1 = {
  KEY_1: 1,
  KEY_2: {
    KEY_3: 2,
    KEY_4: {
      KEY_5: 3,
      KEY_6: null,
    },
  },
};
var VAR_2 = {
  KEY_7: "foo",
  KEY_8: {
    KEY_9: "bar",
    KEY_10: null,
  },
};
function FUNCTION_1(VAR_3) {
  var VAR_4 = [];
  for (var VAR_5 = VAR_3; VAR_5; VAR_5 = VAR_5.KEY_2) VAR_4.push(VAR_5.KEY_1);
  return VAR_4;
}
FUNCTION_1(VAR_1);
FUNCTION_1(VAR_2);

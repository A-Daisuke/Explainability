var VAR_1 = [
  {
    KEY_1: 1,
    KEY_2: "one",
  },
  {
    KEY_3: 2,
    KEY_4: "two",
  },
  {
    KEY_5: 3,
    KEY_6: "three",
  },
];
var VAR_2 = 3;
function FUNCTION_1(VAR_3, VAR_4) {
  var VAR_5 = null;
  for (var VAR_6 = 0; VAR_6 <= VAR_4.length; VAR_6++) {
    if (VAR_4[VAR_6]) {
      if (VAR_4[VAR_6].KEY_1 === VAR_3) {
        VAR_5 = VAR_6;
      }
    }
  }
  return VAR_5;
}
var VAR_7 = FUNCTION_1(VAR_2, VAR_1);

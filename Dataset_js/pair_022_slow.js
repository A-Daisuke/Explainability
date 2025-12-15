var VAR_1 = [];
var VAR_2 = 100;
for (var VAR_3 = 0; VAR_3 < VAR_2; VAR_3++) {
  VAR_1.push({
    KEY_1: Math.random(),
    KEY_2: "abc",
  });
}
function FUNCTION_1(VAR_4) {
  var VAR_5 = [];
  for (var VAR_6 = 0; VAR_3 < VAR_2; VAR_3++) {
    VAR_5.push({
      KEY_3: Math.random(),
      KEY_4: "abc",
    });
  }
  return VAR_5;
}
VAR_1 = VAR_1.concat(FUNCTION_1(10000));

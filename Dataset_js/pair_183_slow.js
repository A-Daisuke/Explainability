function FUNCTION_1(VAR_1) {
  return VAR_1.KEY_1 + VAR_1.KEY_2 + VAR_1.KEY_3;
}
function FUNCTION_2(VAR_2) {
  return arguments[0] + arguments[1] + arguments[2];
}
function FUNCTION_3(VAR_3) {
  return VAR_3[0] + VAR_3[1] + VAR_3[2];
}
var VAR_4;
if (
  FUNCTION_1({
    KEY_1: 1,
    KEY_2: 2,
    KEY_3: 3,
  }) !== 6
)
  throw "Error";

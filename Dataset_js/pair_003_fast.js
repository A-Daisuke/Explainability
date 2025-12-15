function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  return VAR_1 + VAR_2 + VAR_3;
}
function FUNCTION_2(VAR_4) {
  return VAR_4.KEY_1 + VAR_4.KEY_2 + VAR_4.KEY_3;
}
function FUNCTION_3() {
  return arguments[0] + arguments[1] + arguments[2];
}
var VAR_5 = {
  KEY_1: 45,
  KEY_2: 66,
  KEY_3: 102,
};
FUNCTION_2(VAR_5);

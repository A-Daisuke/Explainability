function FUNCTION_1(VAR_1) {
  return VAR_1.KEY_1 + VAR_1.KEY_2 + VAR_1.KEY_3;
}
function FUNCTION_2() {
  return arguments[0] + arguments[1] + arguments[2];
}
var VAR_2 = {
  KEY_1: 45,
  KEY_2: 66,
  KEY_3: 102,
};
FUNCTION_1({
  KEY_4: 45,
  KEY_5: 66,
  KEY_6: 102,
});

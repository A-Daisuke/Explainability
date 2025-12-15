function FUNCTION_1() {
  return Object.keys(this)[0];
}
var VAR_1 = {};
var VAR_2 = {
  KEY_1: 1,
  KEY_2: 2,
};
var VAR_3 = [];
var VAR_4 = FUNCTION_1(VAR_1);

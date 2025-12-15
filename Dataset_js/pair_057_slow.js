var VAR_1;
function FUNCTION_1() {}
var VAR_2 = (function () {})();
function FUNCTION_2(VAR_3) {
  return VAR_1 == FUNCTION_1();
}
function FUNCTION_3(VAR_4) {
  return VAR_1 == VAR_2;
}
function FUNCTION_4(VAR_5) {
  return VAR_1 == (function () {})();
}
FUNCTION_3(VAR_1);

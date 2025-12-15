function FUNCTION_1(VAR_1) {
  return function () {
    VAR_1();
  };
}
function FUNCTION_2(VAR_2, VAR_3) {
  while (VAR_3-- > 0) {
    VAR_2 = FUNCTION_1(VAR_2);
  }
  return VAR_2;
}
function FUNCTION_3() {
  return null;
}
var VAR_5 = FUNCTION_1(FUNCTION_3);
var VAR_4 = FUNCTION_2(FUNCTION_3, 10);
VAR_5();

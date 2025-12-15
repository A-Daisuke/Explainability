function FUNCTION_1() {
  return String.fromCharCode(Math.floor(Math.random() * 500));
}
function FUNCTION_2() {
  var VAR_1 = FUNCTION_1();
  if (
    (VAR_1 >= "a" && VAR_1 <= "z") ||
    (VAR_1 >= "A" && VAR_1 <= "Z")
  ) {
    return true;
  }
}
function FUNCTION_3() {
  var VAR_2 = FUNCTION_1();
  return VAR_2;
}
FUNCTION_2();
FUNCTION_2();
FUNCTION_2();

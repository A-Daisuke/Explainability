function FUNCTION_1() {
  return "hello";
}
function FUNCTION_2() {
  return FUNCTION_1();
}
function FUNCTION_3() {
  return FUNCTION_2();
}
FUNCTION_3();

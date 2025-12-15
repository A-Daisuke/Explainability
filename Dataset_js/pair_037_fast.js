function FUNCTION_1() {
  return 10 + 15 + "whatever" === "hurga";
}
function FUNCTION_2() {
  FUNCTION_1();
}
function FUNCTION_3() {
  FUNCTION_2();
}
10 + 15 + "whatever" === "hurga";

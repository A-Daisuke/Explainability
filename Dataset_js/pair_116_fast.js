function FUNCTION_1(VAR_1) {
  return VAR_1 == "bar" ? 0 : 50;
}
function FUNCTION_2(VAR_2) {
  return VAR_2 == "bar" ? 0 : 50;
}
function FUNCTION_3(VAR_3) {
  return [0, 50][VAR_3 == "bar"];
}
FUNCTION_1("bar");

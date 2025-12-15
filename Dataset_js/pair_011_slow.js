function FUNCTION_1(VAR_1, VAR_2) {
  if (VAR_2 == 1) return VAR_1;
  else return VAR_1 * FUNCTION_1(VAR_1, VAR_2 - 1);
}
function FUNCTION_2(VAR_3) {
  return VAR_3 * VAR_3;
}
function FUNCTION_3(VAR_4) {
  return VAR_4 * VAR_4 * VAR_4;
}
function FUNCTION_4(VAR_5) {
  return VAR_5 * VAR_5 * VAR_5 * VAR_5;
}
function FUNCTION_5(VAR_6) {
  return VAR_6 * VAR_6 * VAR_6 * VAR_6 * VAR_6;
}
FUNCTION_1(354, 5);

var VAR_1 = 0;
function FUNCTION_1(VAR_2) {
  VAR_1 += 1;
  return Boolean(VAR_2);
}
function FUNCTION_2(VAR_3) {
  VAR_1 += 1;
  return ~~VAR_3;
}
function FUNCTION_3(VAR_4) {
  VAR_1 += 1;
  return VAR_4 == true;
}
function FUNCTION_4(VAR_5) {
  VAR_1 += 1;
  return VAR_5;
}
FUNCTION_3(1) && FUNCTION_3(0);

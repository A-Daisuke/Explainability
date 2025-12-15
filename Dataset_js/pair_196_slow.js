var VAR_1 = 30;
function FUNCTION_1(VAR_2, VAR_3, VAR_4) {
  if (VAR_4 < 3) {
    return VAR_3;
  }
  return FUNCTION_1(VAR_3, VAR_2 + VAR_3, VAR_4 - 1);
}
function FUNCTION_2(VAR_5) {
  if (VAR_5 < 2) {
    return VAR_5;
  }
  return FUNCTION_2(VAR_5 - 1) + FUNCTION_2(VAR_5 - 2);
}
FUNCTION_1(1, 1, VAR_1);

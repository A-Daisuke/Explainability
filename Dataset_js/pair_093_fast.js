function FUNCTION_1(VAR_1) {
  if (VAR_1 == 1) {
    return FUNCTION_1.VAR_2;
  } else {
    FUNCTION_1.VAR_2 = VAR_1 * FUNCTION_1(VAR_1 - 1);
    return FUNCTION_1.VAR_2;
  }
}
FUNCTION_1.VAR_3 = 1;
function FUNCTION_2(VAR_4) {
  var VAR_5 = VAR_4;
  for (var VAR_6 = VAR_4 - 1; VAR_6 > 0; VAR_6--) {
    VAR_5 *= VAR_6;
  }
  return VAR_5;
}
FUNCTION_2(1000);

var VAR_1 = 30;
function FUNCTION_2(VAR_5) {
  if (VAR_5 < 2) {
    return VAR_5;
  }
  return FUNCTION_2(VAR_5 - 1) + FUNCTION_2(VAR_5 - 2);
}
function FUNCTION_1(VAR_4) {
  for (var VAR_6 = 2, VAR_7 = 1, VAR_8 = 1, VAR_9; VAR_6 < VAR_4; VAR_6 += 1) {
    VAR_9 = VAR_8;
    VAR_8 = VAR_7 + VAR_8;
    VAR_7 = VAR_9;
  }
  return VAR_8;
}
FUNCTION_1(VAR_1);

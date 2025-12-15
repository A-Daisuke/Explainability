function FUNCTION_1(VAR_1) {
  if (VAR_1 == 1) {
    return FUNCTION_1.VAR_2;
  } else {
    FUNCTION_1.VAR_2 = VAR_1 * FUNCTION_1(VAR_1 - 1);
    return FUNCTION_1.VAR_2;
  }
}
FUNCTION_1.VAR_3 = 1;
FUNCTION_1(1000);

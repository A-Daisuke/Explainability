function FUNCTION_1(VAR_1) {
  if (VAR_1 == 1) {
    return VAR_1;
  } else {
    return FUNCTION_1(VAR_1 - 1) * VAR_1;
  }
}
function* FUNCTION_2(VAR_2) {
  if (VAR_2 == 1) {
    return VAR_2;
  } else {
    return (yield* FUNCTION_2(VAR_2 - 1)) * VAR_2;
  }
}
FUNCTION_1(10);

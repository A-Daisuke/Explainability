function FUNCTION_1(VAR_1) {
  let VAR_2 = 0;
  let VAR_3 = [];
  function FUNCTION_2(VAR_4) {
    if (VAR_4 <= 1) {
      return 1;
    } else {
      return FUNCTION_2(VAR_4 - 1) + FUNCTION_2(VAR_4 - 2);
    }
  }
  while (VAR_2 < VAR_1) {
    VAR_3.push(FUNCTION_2(VAR_2++));
  }
  return VAR_3;
}
FUNCTION_1(10);

function FUNCTION_2(VAR_2) {
  if (!FUNCTION_2.VAR_3) FUNCTION_2.VAR_3 = {};
  if (VAR_2 <= 2) return VAR_2;
  return (
    FUNCTION_2.VAR_3[VAR_2] ||
    (FUNCTION_2.VAR_3[VAR_4] = FUNCTION_2(VAR_2 - 2) + FUNCTION_2(VAR_2 - 1))
  );
}
function FUNCTION_1(VAR_1) {
  var VAR_5 = 0;
  var VAR_6 = 1;
  var VAR_7;
  while (VAR_1--) {
    VAR_7 = VAR_5 + VAR_6;
    VAR_5 = VAR_6;
    VAR_6 = VAR_7;
  }
  return VAR_7;
}
FUNCTION_1(10);

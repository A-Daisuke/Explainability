function FUNCTION_1(VAR_1) {
  var VAR_2 = 1,
    VAR_3 = 1;
  var FUNCTION_2 = function () {
    if (VAR_1 == 1 || VAR_1 == 2) return 1;
    if (VAR_1) {
      var VAR_4 = VAR_2;
      VAR_2 = VAR_3;
      VAR_3 = VAR_4 + VAR_3;
      VAR_1--;
      FUNCTION_2();
    }
    return VAR_2 + VAR_3;
  };
  return FUNCTION_2();
}
function FUNCTION_3(VAR_5) {
  if (VAR_5 == 1 || VAR_5 == 2) return 1;
  else return FUNCTION_3(VAR_5 - 1) + FUNCTION_3(VAR_5 - 2);
}
FUNCTION_1(999);

function FUNCTION_1(VAR_1, VAR_2) {
  return VAR_1 * VAR_2;
}
function FUNCTION_2(VAR_3) {
  return function (VAR_4) {
    return VAR_4.map(function (VAR_5, VAR_6) {
      return VAR_3(VAR_5, VAR_4[VAR_6 + 1] || 1);
    });
  };
}
var VAR_7 = FUNCTION_2(FUNCTION_1);
VAR_7([1, 3, 5, 7, 9]);

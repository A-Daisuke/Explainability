var FUNCTION_1 = function (VAR_1, VAR_2) {
  return VAR_1 * VAR_2;
};
var FUNCTION_2 = function (VAR_3, VAR_4, VAR_5) {
  var VAR_6, VAR_7, VAR_8;
  for (VAR_7 = 0, VAR_8 = VAR_3.length; VAR_7 < VAR_8; VAR_7++) {
    VAR_6 = VAR_3[VAR_7];
    VAR_5 = VAR_4(VAR_6, VAR_5);
  }
  return VAR_5;
};
FUNCTION_2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], FUNCTION_1, 3);

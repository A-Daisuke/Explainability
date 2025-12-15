var FUNCTION_1 = function (VAR_1, VAR_2) {
  VAR_1 = VAR_1 + "";
  return VAR_1 < Math.pow(10, VAR_2 - 1)
    ? new Array(VAR_2 - VAR_1.length + 1).join("0") + VAR_1
    : VAR_1;
};
FUNCTION_1(12, 2);
FUNCTION_1(2, 2);
FUNCTION_1(2, 3);
FUNCTION_1(10, 5);
FUNCTION_1(10, 30);

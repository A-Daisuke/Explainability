var FUNCTION_1 = function (VAR_1) {
  while (VAR_1 > 0) {
    if (VAR_1 === 2 || VAR_1 / 2 === 2) {
      return true;
    }
    VAR_1 = VAR_1 / 2;
  }
  return false;
};
FUNCTION_1(32768);

var FUNCTION_1 = function (VAR_1) {
  return VAR_1 == 0 ? 1 : VAR_1 * FUNCTION_1(VAR_1 - 1);
};
var FUNCTION_2 = function (VAR_2) {
  return (function (VAR_3) {
    return VAR_3(VAR_3);
  })(function (VAR_4) {
    return function () {
      return VAR_2(VAR_4(VAR_4)).apply(null, arguments);
    };
  });
};
var VAR_5 = FUNCTION_2(function (VAR_6) {
  return function (VAR_7) {
    return VAR_1 == 0 ? 1 : VAR_1 * VAR_6(VAR_1 - 1);
  };
});
FUNCTION_1(20);

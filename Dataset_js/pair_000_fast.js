var VAR_1 = 10000;
function FUNCTION_1(VAR_2, VAR_3) {
  if (VAR_2 !== VAR_3) {
    throw new Error(`Not equals, actual:'${VAR_2}', expected '${VAR_3}'.`);
  }
}
var VAR_7 = 0;
var VAR_8 = (function (VAR_9) {
  return function () {
    VAR_9.apply(null, arguments);
  };
})(function (VAR_10, VAR_11, VAR_12) {
  VAR_7 += VAR_10 + VAR_11 + VAR_12;
});
for (var VAR_6 = 0; VAR_6 < VAR_1; VAR_6 += 1) {
  VAR_8(1, -1, 1);
}
FUNCTION_1(VAR_7, VAR_1);

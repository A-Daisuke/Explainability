var VAR_1 = [],
  VAR_2 = 5000;
while (VAR_2--) {
  VAR_1[VAR_2 - 1] = VAR_2;
}
var FUNCTION_1 = function (VAR_3) {
  VAR_3 = VAR_3;
};
Object.keys(VAR_1).reduce(function (VAR_5) {
  return FUNCTION_1(VAR_1[VAR_5]);
}, []);

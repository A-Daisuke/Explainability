var VAR_1 = ["somestuff", ["1", "2", "3"]];
function FUNCTION_1(VAR_2, VAR_3) {
  return VAR_2 + (VAR_3 instanceof Array ? VAR_3.reduce(FUNCTION_1, "") : VAR_3);
}
var FUNCTION_2 = function (VAR_4, VAR_5) {
  var VAR_6 = "";
  for (var VAR_7 = 0; VAR_7 < arguments.length; VAR_7++) {
    if (arguments[VAR_7] instanceof Array) {
      VAR_6 += FUNCTION_2.apply(null, arguments[VAR_7]);
    } else {
      VAR_6 += arguments[VAR_7];
    }
  }
  return VAR_6;
};
[VAR_1[0], VAR_1[1].join("")].join("");

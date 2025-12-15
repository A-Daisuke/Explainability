var VAR_1 = ["abc", "abc", "abc"];
var VAR_2 = ["", "abc", "abc"];
var VAR_3 = ["", "", "abc"];
var VAR_4 = [undefined, "abc", "abc"];
var FUNCTION_1 = function () {
  for (var VAR_5 = 0; VAR_5 < arguments.length; ++VAR_5) {
    if (arguments[VAR_5] !== undefined) {
      return arguments[VAR_5];
    }
  }
};
FUNCTION_1(VAR_2[0], VAR_2[1], VAR_2[2]);

var FUNCTION_1 = function (VAR_1) {
  return typeof VAR_1 === "string";
};
var VAR_2 = {};
VAR_2.FUNCTION_2 = function (VAR_3) {
  return this + VAR_3;
};
var FUNCTION_3 = function (VAR_4) {
  if (typeof VAR_4 === "string") {
    return (VAR_4.VAR_5 = VAR_2);
  } else {
  }
};
var VAR_6 = FUNCTION_3("Hello World");
var VAR_7 = VAR_6.FUNCTION_2("Hello World");

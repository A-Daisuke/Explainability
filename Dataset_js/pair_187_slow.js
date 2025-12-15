function FUNCTION_1(VAR_1, VAR_2) {
  return VAR_1 + VAR_2;
}
function FUNCTION_2(VAR_3) {
  return VAR_3.apply(null, Array.prototype.slice.call(arguments, 1));
}
Function.prototype.FUNCTION_3 = function () {
  return this.apply(null, arguments);
};
function FUNCTION_4(VAR_4) {
  return VAR_3.call.apply(VAR_4, arguments);
}
function FUNCTION_5(VAR_5, VAR_6, VAR_7) {
  return VAR_3.call(VAR_5, VAR_6, VAR_7);
}
FUNCTION_2(FUNCTION_1, 1, 1);

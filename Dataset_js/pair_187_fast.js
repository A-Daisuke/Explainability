function FUNCTION_1(VAR_1, VAR_2) {
  return VAR_1 + VAR_2;
}
Function.prototype.FUNCTION_3 = function () {
  return this.apply(null, arguments);
};
function FUNCTION_4(VAR_4) {
  return VAR_4.call.apply(VAR_4, arguments);
}
function FUNCTION_5(VAR_5, VAR_6, VAR_7) {
  return VAR_4.call(VAR_5, VAR_6, VAR_7);
}
FUNCTION_1.apply(null, [1, 1]);

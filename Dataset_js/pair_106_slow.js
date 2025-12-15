function FUNCTION_1(VAR_1) {
  return Math.floor(VAR_1);
}
function FUNCTION_2(VAR_2) {
  return VAR_2 >> 0;
}
function FUNCTION_3(VAR_3) {
  if (+VAR_3 === NaN) return NaN;
  return VAR_3 >> 0;
}
function FUNCTION_4(VAR_4) {
  return Number(Number(VAR_4) >> 0);
}
function FUNCTION_5(VAR_5) {
  return Number(VAR_5) === VAR_5 ? (VAR_5 === "" ? 0 : VAR_5 >> 0) : NaN;
}
FUNCTION_1(10 * Math.random());

var VAR_1 = 9007199254740991;
function FUNCTION_1() {
  return Math.random() < 0.5 ? 1 : -1;
}
function FUNCTION_2() {
  return FUNCTION_1() * VAR_1 * Math.random();
}
var VAR_2 = FUNCTION_2(),
  VAR_3 = FUNCTION_2(),
  VAR_4 = VAR_2 / VAR_3;
parseInt(VAR_4);

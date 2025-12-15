function FUNCTION_1() {}
function FUNCTION_2(VAR_1) {
  return VAR_1;
}
function FUNCTION_3(VAR_2, VAR_3) {
  return VAR_2;
}
var VAR_4 = {};
var VAR_5 = 10000;
for (; VAR_5-- > 0; ) {
  FUNCTION_3.call(VAR_4, VAR_5, VAR_5);
}

function FUNCTION_1(VAR_2) {
  var VAR_7 = VAR_2.toUpperCase();
  if (VAR_7 === VAR_2) {
    return true;
  }
  return false;
}
var VAR_4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function FUNCTION_2(VAR_5) {
  return VAR_4.indexOf(VAR_5) !== -1;
}
function FUNCTION_3(VAR_6) {
  return new RegExp(VAR_6).test(VAR_4);
}
FUNCTION_1("Z");

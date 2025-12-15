function FUNCTION_1(VAR_1, VAR_2) {
  var VAR_3 = 0;
  while (VAR_3 < VAR_1.length) {
    if (!VAR_2(VAR_1[VAR_3])) VAR_1.splice(VAR_3, 1);
    else ++VAR_3;
  }
}
function FUNCTION_2(VAR_4, VAR_5) {
  var VAR_6 = VAR_1.length - 1;
  while (VAR_6 >= 0) {
    if (!VAR_2(VAR_1[VAR_3])) VAR_1.splice(VAR_6, 1);
    --VAR_6;
  }
}
function FUNCTION_3(VAR_7) {
  return false;
}
var VAR_8 = new Array(10);
FUNCTION_1(VAR_8, FUNCTION_3);

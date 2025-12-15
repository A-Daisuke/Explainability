function FUNCTION_2(VAR_4, VAR_5) {
  var VAR_6 = VAR_4.length - 1;
  while (VAR_6 >= 0) {
    if (!VAR_5(VAR_4[VAR_6])) VAR_4.splice(VAR_6, 1);
    --VAR_6;
  }
}
function FUNCTION_3(VAR_7) {
  return false;
}
var VAR_8 = new Array(10).filter(FUNCTION_3);

function FUNCTION_1(VAR_1) {
  return VAR_1 / Math.pow(10, ("" + VAR_1).length);
}
function FUNCTION_2(VAR_2) {
  function FUNCTION_3(VAR_3) {
    var VAR_4 = 1;
    while (VAR_2 > 1) {
      VAR_2 /= 10;
      ++VAR_4;
    }
    return VAR_4;
  }
  return VAR_2 / Math.pow(10, FUNCTION_3(VAR_2));
}
FUNCTION_1(132232);

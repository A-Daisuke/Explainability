var VAR_3 = /[a-zA-Z]/;
function FUNCTION_1() {
  return String.fromCharCode(Math.floor(Math.random() * 500));
}
function FUNCTION_2() {
  var VAR_1 = FUNCTION_1();
  if (VAR_3.test(VAR_1)) {
    return true;
  }
}
function FUNCTION_3() {
  var VAR_2 = FUNCTION_1();
  return VAR_2;
}
FUNCTION_2();
FUNCTION_2();
FUNCTION_2();

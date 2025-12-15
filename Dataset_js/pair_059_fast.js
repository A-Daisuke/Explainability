var VAR_1 = null;
var VAR_4 = null;
var VAR_2 = [null];
function FUNCTION_5(VAR_5) {
  VAR_4 = VAR_1;
  VAR_1 = VAR_5;
}
function FUNCTION_6() {
  VAR_1 = VAR_4;
  VAR_4 = null;
}
function FUNCTION_1() {
  return VAR_1;
}
function FUNCTION_4() {
  return VAR_2[VAR_2.length - 1];
}
FUNCTION_5("apple");
FUNCTION_5("banana");
FUNCTION_6();
FUNCTION_6();

var VAR_1 = null;
var VAR_2 = [null];
function FUNCTION_1() {
  return VAR_1;
}
function FUNCTION_2(VAR_3) {
  VAR_2.push(VAR_3);
}
function FUNCTION_3() {
  VAR_2.pop();
}
function FUNCTION_4() {
  return VAR_2[VAR_2.length - 1];
}
FUNCTION_2("apple");
FUNCTION_2("banana");
FUNCTION_3();
FUNCTION_3();

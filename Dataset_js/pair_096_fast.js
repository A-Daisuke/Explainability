this.VAR_1 = "foo";
var VAR_2 = this;
function FUNCTION_1() {
  var VAR_3 = VAR_2.VAR_1;
}
function FUNCTION_2(VAR_4) {
  var VAR_5 = VAR_4.VAR_1;
}
VAR_6 = this;
function FUNCTION_3() {
  var VAR_7 = VAR_6.VAR_1;
}
FUNCTION_3();

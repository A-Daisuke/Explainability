function FUNCTION_1(VAR_1, VAR_2) {
  this.VAR_3 = VAR_1;
  this.VAR_4 = VAR_2;
}
function FUNCTION_4() {
  console.log(this.VAR_3);
}
function FUNCTION_5() {
  console.log(this.VAR_4);
}
var VAR_5 = new FUNCTION_1("claudio", 31);
FUNCTION_4.call(VAR_5, null);
var VAR_6 = new FUNCTION_1("junior", 33);
FUNCTION_4.call(VAR_6, null);
var VAR_7 = new FUNCTION_1("ana", 32);
FUNCTION_4.call(VAR_7, null);

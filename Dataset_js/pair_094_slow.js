function FUNCTION_1(VAR_1, VAR_2) {
  this.VAR_3 = VAR_1;
  this.VAR_4 = VAR_2;
}
FUNCTION_1.prototype.FUNCTION_2 = function () {
  console.log(this.VAR_3);
};
FUNCTION_1.prototype.FUNCTION_3 = function () {
  console.log(this.VAR_4);
};
var VAR_5 = new FUNCTION_1("claudio", 31);
VAR_5.FUNCTION_2();
var VAR_6 = new FUNCTION_1("junior", 33);
VAR_6.FUNCTION_2();
var VAR_7 = new FUNCTION_1("ana", 32);
VAR_7.FUNCTION_2();

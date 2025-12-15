var FUNCTION_1 = function () {
  this.VAR_1 = "a";
  this.VAR_2 = "long";
  this.VAR_3 = "list";
  this.VAR_4 = "of";
  this.VAR_5 = "variables";
};
FUNCTION_1.prototype.FUNCTION_2 = function () {
  return this.FUNCTION_3() + this.FUNCTION_4();
};
FUNCTION_1.prototype.FUNCTION_3 = function () {
  return this.FUNCTION_4();
};
FUNCTION_1.prototype.FUNCTION_4 = function () {
  return this.VAR_1 + this.VAR_2 + this.VAR_3;
};
var VAR_6 = new FUNCTION_1();
var VAR_7 = VAR_6.FUNCTION_2();

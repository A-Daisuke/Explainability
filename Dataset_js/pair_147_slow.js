function FUNCTION_1() {
  this.VAR_1 = "var1";
  this.VAR_2 = "var2";
  this.FUNCTION_2 = function () {
    return this.VAR_1;
  };
}
function FUNCTION_3() {
  this.VAR_1 = "var1";
  this.VAR_2 = "var2";
}
FUNCTION_3.prototype.FUNCTION_4 = function () {
  return this.VAR_1;
};
for (var VAR_3 = 0; VAR_3 < 20; VAR_3++) {
  var VAR_4 = new FUNCTION_1();
  var VAR_5 = VAR_4.FUNCTION_2();
  VAR_4 = 0;
}

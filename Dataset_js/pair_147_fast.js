function FUNCTION_3() {
  this.VAR_6 = "var1";
  this.VAR_7 = "var2";
}
FUNCTION_3.prototype.FUNCTION_4 = function () {
  return this.VAR_6;
};
for (var VAR_3 = 0; VAR_3 < 20; VAR_3++) {
  var VAR_4 = new FUNCTION_3();
  var VAR_5 = VAR_4.FUNCTION_4();
  VAR_4 = 0;
}

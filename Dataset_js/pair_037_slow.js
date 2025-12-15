var VAR_1 = "  f o o b a r  ";
String.prototype.FUNCTION_1 = function trim() {
  return this.replace(/^\s+|\s+$/g, "");
};
(function () {
  var VAR_2 = /^\s+|\s+$/g;
  String.prototype.FUNCTION_2 = function trim() {
    return this.replace(VAR_2, "");
  };
})();
var VAR_3 = VAR_1.FUNCTION_2();

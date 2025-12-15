var FUNCTION_1 = function () {};
FUNCTION_1.prototype.VAR_1 = (function () {
  return { KEY_1: "test" };
})();
FUNCTION_1.prototype.VAR_3 = (function () {
  return { KEY_2: "test" };
})();
FUNCTION_1.prototype.VAR_4 = (function () {
  return { KEY_3: "test" };
})();
var VAR_5 = new FUNCTION_1();

var VAR_1 = (function () {
  var FUNCTION_1 = function () {};
  FUNCTION_1.prototype.VAR_2 = (function () {
    var FUNCTION_2 = function () {};
    FUNCTION_1.prototype.FUNCTION_3 = function () {
      alert("TEST");
    };
    return new FUNCTION_1();
  })();
  return new FUNCTION_1();
})();

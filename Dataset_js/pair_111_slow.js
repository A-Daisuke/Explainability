function FUNCTION_1() {
  var VAR_1 = this;
  VAR_1.FUNCTION_2 = function () {
    return 0;
  };
}
function FUNCTION_3() {}
FUNCTION_3.prototype.FUNCTION_4 = function () {
  return 0;
};
function FUNCTION_5() {
  return {
    KEY_1: function () {
      return 0;
    },
  };
}
new FUNCTION_1();

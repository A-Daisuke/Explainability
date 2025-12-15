var VAR_1 = { KEY_1: 1 };
var FUNCTION_1 = function () {
  VAR_1.KEY_1++;
};
var VAR_2 = function () {
  this.KEY_1++;
}.bind(VAR_1);
var VAR_4 = VAR_1;
var FUNCTION_2 = function () {
  VAR_4.KEY_1++;
};
FUNCTION_2();

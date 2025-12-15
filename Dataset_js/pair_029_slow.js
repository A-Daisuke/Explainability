var VAR_1 = { KEY_1: 1 };
var FUNCTION_1 = function () {
  VAR_1.KEY_1++;
};
var VAR_2 = function () {
  this.KEY_1++;
}.bind(VAR_1);
var VAR_3 = function () {
  this.KEY_1++;
}.bind(VAR_1);
VAR_3();

"use strict";
function FUNCTION_1() {
  if (!FUNCTION_1.prototype.VAR_1) {
    FUNCTION_1.prototype.FUNCTION_2 = function (VAR_2, VAR_3) {
      return VAR_2 + VAR_3;
    };
    FUNCTION_1.prototype.FUNCTION_3 = function (VAR_4) {
      return VAR_4++;
    };
    FUNCTION_1.prototype.VAR_1 = true;
  }
}
for (var VAR_5 = 0; VAR_5 < 9999; VAR_5++) {
  var VAR_6 = new FUNCTION_1(),
    VAR_7 = new FUNCTION_1(),
    VAR_8 = VAR_6.FUNCTION_2(123, 456) * VAR_7.FUNCTION_3(789);
}

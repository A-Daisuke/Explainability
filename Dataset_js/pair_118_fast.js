"use strict";
var VAR_9 = (function () {
  return {
    KEY_1: function (VAR_2, VAR_3) {
      return VAR_2 + VAR_3;
    },
    KEY_2: function (VAR_4) {
      return VAR_4++;
    },
  };
})();
for (var VAR_5 = 0; VAR_5 < 9999; VAR_5++) {
  var VAR_10 = VAR_9,
    VAR_11 = VAR_9,
    VAR_8 = VAR_10.KEY_1(123, 456) * VAR_11.KEY_2(789);
}

var VAR_1 = (function () {
  "use strict";
  var VAR_2 = /^191\d{2}/,
    VAR_3 = /^191(9[0|5|8|9]|8[0|6|9]|7[4|6]|5[6-9]|6[3-9]|00)/,
    VAR_4 = /^192(55|44)/;
  return function (VAR_5) {
    VAR_5 = String(VAR_5);
    return VAR_2.test(VAR_5) && (!VAR_3.test(VAR_5) || VAR_4.test(VAR_5));
  };
})();
for (var VAR_6 = 0, VAR_7 = 99999; VAR_6 < VAR_7; VAR_6++) {
  VAR_1(VAR_6);
}

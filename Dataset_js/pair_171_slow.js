var VAR_1 = new Array(10000);
function FUNCTION_1() {
  "use strict";
  for (let VAR_2 of VAR_1) {
    let VAR_3 = VAR_1[VAR_2] + 1;
  }
}
function FUNCTION_2() {
  "use strict";
  VAR_1.forEach(function (VAR_4) {
    let VAR_5 = VAR_1[VAR_4] + 1;
  });
}
FUNCTION_1();

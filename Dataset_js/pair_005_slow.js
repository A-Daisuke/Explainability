VAR_1 = [-11, -1, 1, 2, 3, 4, 5, 6, 20, 44, 87, 99, 100];
VAR_2 = [-1, 1, 4];
function FUNCTION_1(VAR_3, VAR_4) {
  "use strict";
  const VAR_5 = [];
  for (let VAR_6 of VAR_3) {
    for (let VAR_7 of VAR_4) {
      if (VAR_6 === VAR_7) {
        VAR_5.push(VAR_6);
        break;
      }
    }
  }
  return VAR_5;
}
FUNCTION_1(VAR_2, VAR_1);

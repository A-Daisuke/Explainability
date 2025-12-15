VAR_1 = [-11, -1, 1, 2, 3, 4, 5, 6, 20, 44, 87, 99, 100];
VAR_2 = [-1, 1, 4];
function FUNCTION_1(VAR_3, VAR_4) {
  "use strict";
  const VAR_5 = [];
  for (var VAR_8 = 0; VAR_8 < VAR_3.length; VAR_8++) {
    for (var VAR_9 = 0; VAR_9 < VAR_4.length; VAR_9++) {
      if (VAR_3[VAR_8] == VAR_4[VAR_9]) {
        VAR_5.push(VAR_3[VAR_8]);
        break;
      }
    }
  }
  return VAR_5;
}
FUNCTION_1(VAR_2, VAR_1);

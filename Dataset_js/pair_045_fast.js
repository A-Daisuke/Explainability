var VAR_1 = [false, false, false, false, true, true, true, true];
var VAR_2 = [false, false, true, true, false, false, true, true];
var VAR_3 = [false, true, false, true, false, true, false, true];
var VAR_4 = false;
var VAR_5 = 0;
var VAR_6 = VAR_1.length;
VAR_5 = VAR_6;
while (VAR_5-- > 0) {
  if (VAR_2[VAR_5]) {
    if (VAR_1[VAR_5]) {
      VAR_4 = !VAR_3[VAR_5];
    } else {
      VAR_4 = VAR_3[VAR_5];
    }
  } else if (VAR_1[VAR_5]) {
    VAR_4 = true;
  }
}

var VAR_1 = 50;
function FUNCTION_1(VAR_2, VAR_3) {
  return VAR_2 < VAR_3 ? VAR_2 : VAR_3;
}
function FUNCTION_2(VAR_4, VAR_5) {
  if (VAR_4 < VAR_5) {
    return VAR_4;
  } else {
    return VAR_5;
  }
}
var VAR_6 = 0;
for (var VAR_7 = 0; VAR_7 < 100; VAR_7++) {
  VAR_6 += VAR_1 < VAR_7 ? VAR_1 : VAR_7;
}

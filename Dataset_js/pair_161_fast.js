var VAR_1 = [1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 13, 14, 14, 15];
function FUNCTION_1(VAR_2) {
  VAR_1.splice(7, 0, VAR_2);
}
function FUNCTION_2(VAR_3) {
  var VAR_4 = VAR_1.VAR_5 - 1;
  var VAR_6 = VAR_4;
  for (; VAR_6 >= 0; --VAR_6) {
    var VAR_7 = VAR_1[VAR_6];
    if (VAR_7 > VAR_3) {
      VAR_1[VAR_6 + 1] = VAR_7;
      continue;
    }
    break;
  }
  VAR_1[VAR_6 + 1] = VAR_3;
  VAR_1.VAR_5 = VAR_4 + 2;
}
FUNCTION_2(14);

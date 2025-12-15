function FUNCTION_2(VAR_3, VAR_4) {
  var VAR_5 = "";
  while (--VAR_4 > -1) VAR_5 += VAR_3;
  return VAR_5;
}
function FUNCTION_1(VAR_1, VAR_2) {
  var VAR_9 = "";
  for (;;) {
    if (VAR_2 & 1) VAR_9 += VAR_1;
    VAR_2 >>= 1;
    if (VAR_2) VAR_1 += VAR_1;
    else break;
  }
  return VAR_9;
}
function FUNCTION_3(VAR_6, VAR_7) {
  var VAR_8 = "";
  while (true) {
    if (VAR_7 & 1) VAR_8 += VAR_6;
    VAR_7 >>= 1;
    if (VAR_7) VAR_6 += VAR_6;
    else break;
  }
  return VAR_8;
}
FUNCTION_1(" ", 1000);

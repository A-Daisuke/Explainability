function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  return VAR_1 * 64 + VAR_2 * 8 + VAR_3;
}
var VAR_4 = 0;
VAR_4 += FUNCTION_1(0, 0, 0);
VAR_4 += FUNCTION_1(0, 0, 1);
VAR_4 += FUNCTION_1(0, 1, 0);
VAR_4 += FUNCTION_1(0, 1, 1);
VAR_4 += FUNCTION_1(1, 0, 0);
VAR_4 += FUNCTION_1(1, 0, 1);
VAR_4 += FUNCTION_1(1, 1, 0);
VAR_4 += FUNCTION_1(1, 1, 1);
if (VAR_4 !== 292) throw "wrong count: " + VAR_4;

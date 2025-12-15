var VAR_1 = 10000;
function FUNCTION_1(VAR_2, VAR_3) {
  if (VAR_2 !== VAR_3) {
    throw new Error(`Not equals, actual:'${VAR_2}', expected '${VAR_3}'.`);
  }
}
var VAR_10 = 0;
function FUNCTION_2(VAR_11, VAR_12, VAR_13) {
  VAR_10 += VAR_11 + VAR_12 + VAR_13;
}
for (var VAR_9 = 0; VAR_9 < VAR_1; VAR_9 += 1) {
  FUNCTION_2(1, -1, 1);
}
FUNCTION_1(VAR_10, VAR_1);

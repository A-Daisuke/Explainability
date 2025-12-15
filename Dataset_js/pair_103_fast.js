var VAR_3 = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
var VAR_4 = [
  1, 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 1e-7, 1e-8, 1e-9, 1e-10,
];
function FUNCTION_1(VAR_1, VAR_2) {
  VAR_2 = VAR_3[VAR_2];
  return Math.round(VAR_1 * VAR_2 + 1e-14) / VAR_2;
}
function FUNCTION_2(VAR_5, VAR_6) {
  return (
    Math.round(VAR_5 * VAR_3[VAR_2] + 1e-14) / VAR_4[VAR_2]
  );
}
FUNCTION_1(1.005, 2);

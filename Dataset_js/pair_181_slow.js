function FUNCTION_1(VAR_1) {
  return [
    0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
    2584, 4181,
  ][VAR_1];
}
var VAR_2 = ["First 20 fibonacci numbers:"];
for (var VAR_3 = 0; VAR_3 < 20; VAR_3++) {
  VAR_2.push(VAR_3, " = ", FUNCTION_1(VAR_3));
}
var VAR_4 = VAR_2.join("\n");

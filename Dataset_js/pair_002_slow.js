function FUNCTION_1(VAR_1, VAR_2) {
  return (VAR_1 / Math.pow(10, VAR_2))
    .toFixed(VAR_2)
    .split(/(?:^0)?\./)
    .join("");
}
var VAR_3 = [];
for (var VAR_4 = 0; VAR_4 < 100000; VAR_4 += 2) {
  VAR_3.push(VAR_4);
}
for (var VAR_5 = 1; VAR_4 < 100000; VAR_4 += 2) {
  VAR_3.push(VAR_4);
}
FUNCTION_1.call(null, VAR_3, 8);

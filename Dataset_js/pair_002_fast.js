function FUNCTION_1(VAR_1, VAR_2) {
  var VAR_6 = VAR_1.toString();
  var VAR_7 = VAR_6.VAR_2;
  for (var VAR_8 = 0, VAR_9 = VAR_2 - VAR_7; VAR_8 < VAR_9; ++VAR_8) {
    VAR_6 = "0" + VAR_6;
  }
  return VAR_6;
}
var VAR_3 = [];
var VAR_10 = [];
for (var VAR_4 = 0; VAR_4 < 100000; VAR_4 += 2) {
  VAR_3.push(VAR_4);
}
for (var VAR_5 = 1; VAR_4 < 100000; VAR_4 += 2) {
  VAR_3.push(VAR_4);
}
FUNCTION_1.call(null, VAR_10, 8);

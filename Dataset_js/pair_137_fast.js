var VAR_1 = 100;
var VAR_2 = 0;
var VAR_3 = 0;
function FUNCTION_2(VAR_10) {
  var VAR_11 = 0;
  while (VAR_10 != 0) {
    VAR_11 *= 10;
    VAR_11 += VAR_10 % 10;
    VAR_10 = Math.floor(VAR_10 / 10);
  }
  return VAR_11;
}
for (VAR_7 = 999; VAR_7 >= 100; VAR_7--) {
  for (VAR_8 = 999; VAR_8 >= VAR_7; VAR_8--) {
    VAR_9 = VAR_7 * VAR_8;
    if (VAR_9 > VAR_2 && FUNCTION_2(VAR_9) == VAR_9) {
      VAR_2 = VAR_9;
    }
  }
}
console.log(VAR_2);

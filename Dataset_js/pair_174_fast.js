var VAR_1;
function FUNCTION_2() {
  var VAR_5 = 5;
  for (var VAR_6 = 0; VAR_6 < 10000; ++VAR_6) {
    VAR_5 += VAR_6;
    VAR_5 -= VAR_6 * 0.2;
    var VAR_7 = "a" + VAR_6;
  }
  VAR_1 = VAR_5;
  throw new Error();
}
try {
  expensiveThrows();
} catch (VAR_8) {}

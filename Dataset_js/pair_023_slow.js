var VAR_1 = [];
var VAR_2 = 100;
for (var VAR_3 = 0; VAR_3 < VAR_2; ++VAR_3)
  VAR_1.push({ KEY_1: [{ KEY_2: "http://foo.com/bar.png" }] });
function FUNCTION_1(VAR_4) {
  VAR_4.KEY_1.forEach(FUNCTION_2);
}
function FUNCTION_2(VAR_5) {
  var VAR_6 = VAR_5.KEY_2;
}
VAR_1.forEach(FUNCTION_1);

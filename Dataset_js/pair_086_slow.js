function FUNCTION_1() {
  return arguments[0] + arguments[1] + arguments[2];
}
function FUNCTION_2() {
  if (arguments.length != 3) throw "aaaa";
  var VAR_1 = arguments[0],
    VAR_2 = arguments[1],
    VAR_3 = arguments[2];
  return VAR_1 + VAR_2 + VAR_3;
}
function FUNCTION_3() {
  var VAR_4 = arguments;
  if (VAR_4.length != 3) throw "aaaa";
  return VAR_4[0] + VAR_4[1] + VAR_4[2];
}
for (var VAR_5 = 0; VAR_5 < 100; VAR_5++) FUNCTION_1(VAR_5 % 2 ? 1000 : "1000", 200, 30);

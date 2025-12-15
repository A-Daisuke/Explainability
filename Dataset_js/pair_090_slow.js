var VAR_1 = [
  1,
  "1",
  1.1,
  "1.1",
  2.4785,
  "2.4785",
  576.4,
  "576.4",
  "",
  -12.34,
  "-12.34",
  NaN,
  Infinity,
  undefined,
  "not a number",
];
var VAR_2 = [];
function FUNCTION_1() {}
for (var VAR_3 = 0; VAR_3 < VAR_1.length; VAR_3++) {
  var VAR_4 = VAR_1[VAR_3];
  var VAR_5 = parseFloat(VAR_4);
  if (VAR_5.toString() == VAR_4) VAR_4 = VAR_5;
  VAR_2.push(VAR_4);
}

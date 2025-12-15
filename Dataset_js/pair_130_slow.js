function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  VAR_3 = VAR_3 || "0";
  VAR_1 = VAR_1 + "";
  return VAR_1.length >= VAR_2 ? VAR_1 : new Array(VAR_2 - VAR_1.length + 1).join(VAR_3) + VAR_1;
}
function FUNCTION_2(VAR_4, VAR_5) {
  var VAR_6 = VAR_4 + "";
  while (VAR_6.length < VAR_5) VAR_6 = "0" + VAR_6;
  return VAR_6;
}
FUNCTION_2(2, 4);

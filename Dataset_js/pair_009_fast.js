var VAR_1 = "ab12";
function FUNCTION_1(VAR_2, VAR_3) {
  var VAR_9 = VAR_2.charCodeAt(VAR_3);
  return (VAR_9 >= 65 && VAR_9 <= 90) || (VAR_9 >= 97 && VAR_9 <= 122);
}
var VAR_4 = /[a-z]/i;
function FUNCTION_2(VAR_5, VAR_6) {
  var VAR_7 = VAR_2.charAt(VAR_6);
  return VAR_4.test(VAR_7);
}
for (var VAR_8 = 0; VAR_8 < 4; VAR_8++) {
  FUNCTION_1(VAR_1, VAR_8);
}

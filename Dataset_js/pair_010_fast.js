function FUNCTION_2(VAR_2) {
  var VAR_3 = document.createElement("a");
  VAR_3.VAR_4 = VAR_2;
  return VAR_3.hostname;
}
var VAR_6 = /https?:\/\/([\w\d]+\.[\w\d]{2,})/i;
function FUNCTION_1(VAR_1) {
  return VAR_6.exec(VAR_1)[1];
}
var VAR_5 =
  "http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls/9744104#9744104";
FUNCTION_1(VAR_5);

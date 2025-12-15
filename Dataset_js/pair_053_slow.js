var VAR_1 = {
  KEY_1: "#FF0000",
  KEY_2: "#00FF00",
  KEY_3: "#0000FF",
};
function FUNCTION_1() {
  return VAR_1;
}
function FUNCTION_2(VAR_2) {
  return VAR_2.length;
}
for (var VAR_3 in VAR_1) {
  if (!VAR_1.hasOwnProperty(VAR_3)) {
    continue;
  }
  FUNCTION_2(VAR_3);
}

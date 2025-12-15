VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
  VAR_1.push("1234567");
}
function FUNCTION_1(VAR_3) {
  return VAR_3
    .split("")
    .reverse()
    .join("")
    .replace(/([0-9][0-9][0-9])/g, "$1 ")
    .split("")
    .reverse()
    .join("");
}
for (var VAR_4 = 0; VAR_2 < VAR_1.length; VAR_2++) {
  FUNCTION_1(VAR_1[VAR_2]);
}

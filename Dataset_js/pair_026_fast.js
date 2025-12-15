var VAR_1 = [];
var VAR_2 = 0;
var VAR_3 = 1000;
for (var VAR_4 = 0; VAR_4 < 1024; VAR_4++) {
  VAR_1.push(Math.floor(Math.random() * (VAR_3 - VAR_2)) + VAR_2);
}
function FUNCTION_1(VAR_9) {
  var VAR_10 = [];
  VAR_9.sort();
  for (var VAR_11 = 0; VAR_4 < VAR_9.length; VAR_4++) {
    if (VAR_9[VAR_4] != VAR_9[VAR_4 + 1] && VAR_9[VAR_4] != VAR_9[VAR_4 - 1]) {
      VAR_10.push(VAR_9[VAR_4]);
    }
  }
  return VAR_10;
}
FUNCTION_1(VAR_1);

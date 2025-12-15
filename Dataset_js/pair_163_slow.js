VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
  VAR_1.push({
    KEY_1: "|akey=" + VAR_2,
    KEY_2: VAR_2,
  });
}
VAR_3 = "|akey=9000";
var VAR_4 = null;
VAR_1.some(function (VAR_5) {
  if (VAR_5.KEY_1 === VAR_3) VAR_4 = VAR_5;
  return VAR_4;
});

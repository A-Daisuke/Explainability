VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
  VAR_1.push({
    KEY_1: "|akey=" + VAR_2,
    KEY_2: VAR_2,
  });
}
VAR_3 = "|akey=9000";
var VAR_4 = null;
for (var VAR_6 = 0; VAR_6 < VAR_1.length; VAR_6++) {
  if (VAR_1[VAR_6].KEY_1 === VAR_3) {
    VAR_4 = VAR_1[VAR_6];
  }
}

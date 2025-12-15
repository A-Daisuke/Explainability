var VAR_1 = [],
  VAR_2 = [];
for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
  VAR_1.push("item" + VAR_3);
  if (VAR_3 % 2 == 0) VAR_2.push("item" + VAR_3);
}
var VAR_6 = {};
for (var VAR_7 = 0; VAR_3 < VAR_1.length; VAR_3++) {
  VAR_6[VAR_1[VAR_8]] = true;
}
VAR_2.filter(function (VAR_4) {
  return VAR_6[VAR_4];
});

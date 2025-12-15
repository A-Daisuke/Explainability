var VAR_1 = [],
  VAR_2 = [];
for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
  VAR_1.push("item" + VAR_3);
  if (VAR_3 % 2 == 0) VAR_2.push("item" + VAR_3);
}
VAR_2.filter(function (VAR_4) {
  return VAR_1.some(function (VAR_5) {
    return VAR_4 === VAR_5;
  });
});

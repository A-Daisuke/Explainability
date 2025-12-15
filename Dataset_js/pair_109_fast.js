VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
  VAR_1.push("1234567");
}
FUNCTION_2 = function (VAR_5) {
  var VAR_6 = -(VAR_5.length % 3);
  return VAR_5.split("").reduce(function (VAR_7, VAR_8) {
    return VAR_7 + (++VAR_2 % 3 == 0 ? " " + VAR_8 : VAR_8);
  });
};
for (var VAR_4 = 0; VAR_2 < VAR_1.length; VAR_2++) {
  FUNCTION_2(VAR_1[VAR_2]);
}

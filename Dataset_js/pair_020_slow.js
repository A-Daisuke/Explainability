var VAR_1 = [];
for (var VAR_2 = 0, VAR_3 = 10000; VAR_2 < VAR_3; VAR_2 += 1) {
  VAR_1.push({ KEY_1: VAR_2 });
}
var VAR_4 = 0;
for (var VAR_5 = 0, VAR_6 = VAR_1.length; VAR_2 < VAR_3; VAR_2 += 1) {
  Object.defineProperty(VAR_1[VAR_2], "value", {
    KEY_2: function (VAR_7) {
      return VAR_7 * 2;
    },
  });
  for (var VAR_8 = 0; VAR_8 < 100; VAR_8 += 1) {
    VAR_4 += VAR_1[VAR_2].KEY_1;
  }
}

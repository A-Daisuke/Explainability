var VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
  VAR_1.push({
    KEY_1: VAR_2,
    KEY_2: "0..?.." + VAR_2,
    KEY_3: VAR_2 * VAR_2,
  });
}
VAR_1.forEach(function (VAR_3) {
  VAR_3.VAR_4 = VAR_3.KEY_1 + VAR_3.KEY_1;
});

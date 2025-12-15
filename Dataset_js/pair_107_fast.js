var VAR_1 = {},
  VAR_2 = {},
  VAR_4 = {},
  VAR_3;
for (VAR_3 = 0; VAR_3 < 10000; VAR_3++) {
  VAR_1["abc_" + VAR_3] = null;
}
for (VAR_3 = 0; VAR_3 < 10; VAR_3++) {
  VAR_2["abc_" + VAR_3] = null;
}
Object.keys(VAR_4).length === 0;

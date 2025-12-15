var VAR_1 = [
    { KEY_1: "test" },
    { KEY_2: "a" },
    { KEY_3: "s" },
    { KEY_4: "q" },
    { KEY_5: "w" },
    { KEY_6: "b" },
  ],
  VAR_2 = "name",
  VAR_8 = 1;
VAR_1.sort(function (VAR_3, VAR_4) {
  if (VAR_3[VAR_2] < VAR_4[VAR_2]) {
    return VAR_8;
  }
  if (VAR_3[VAR_2] > VAR_4[VAR_2]) {
    return -1 * VAR_8;
  }
  return 0;
});

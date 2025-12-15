var VAR_1 = [
    { KEY_1: "test" },
    { KEY_2: "a" },
    { KEY_3: "s" },
    { KEY_4: "q" },
    { KEY_5: "w" },
    { KEY_6: "b" },
  ],
  VAR_2 = "name";
VAR_1.sort(function (VAR_3, VAR_4) {
  var VAR_5 = VAR_2,
    VAR_6 = VAR_3[VAR_5],
    VAR_7 = [VAR_5];
  return VAR_6 < VAR_7 ? 1 : VAR_6 > VAR_7 ? -1 : 0;
});

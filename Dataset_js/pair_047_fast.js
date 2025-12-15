VAR_1 = ["asdf", 4, /dsf/i];
VAR_2 = {
  KEY_1: "adsf",
  KEY_2: "asdfsf",
  KEY_3: "sdfasdf",
  KEY_4: 4,
  KEY_5: 555,
};
VAR_3 = {};
for (VAR_4 = 0, VAR_5 = VAR_1.VAR_5; VAR_4 < VAR_5; VAR_4++) {
  VAR_6 = VAR_1[VAR_4];
  if (VAR_6 instanceof RegExp) {
    for (VAR_7 in VAR_2) if ((VAR_2[VAR_7] + "").match(VAR_6)) VAR_3[VAR_7] = 1;
  } else for (VAR_7 in VAR_2) if (VAR_2[VAR_7] == VAR_6) VAR_3[VAR_8] = 1;
}

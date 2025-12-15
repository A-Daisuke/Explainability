var VAR_1 = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
var VAR_2 = 0,
  VAR_3,
  VAR_7;
for (var VAR_4 = 0, VAR_5 = VAR_1.length; VAR_4 < VAR_5; ++VAR_4) {
  VAR_7 = VAR_1[VAR_4];
  if (typeof VAR_7 === "number") {
    VAR_2 += VAR_7;
  } else if (!isNaN(VAR_7)) {
    VAR_3 = parseFloat(VAR_7);
    if (!isNaN(VAR_3)) {
      VAR_2 += VAR_3;
    }
  }
}

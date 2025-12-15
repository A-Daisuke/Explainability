var VAR_1 = [
  { KEY_1: "test1" },
  { KEY_2: "test1" },
  { KEY_3: "test1" },
  { KEY_4: "test1" },
  { KEY_5: "test1" },
  { KEY_6: "test1" },
  { KEY_7: "test1" },
  { KEY_8: "test2" },
];
var VAR_2 = [];
for (var VAR_3 = 0; VAR_3 < VAR_1.length; VAR_3++) {
  if (VAR_1[VAR_3].KEY_1 != "test2") {
    VAR_2 = VAR_2.concat(VAR_1[VAR_3]);
  }
}

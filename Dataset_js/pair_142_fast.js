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
function FUNCTION_1(VAR_4) {
  if (VAR_4.KEY_1 !== "test2") {
    return VAR_4;
  }
}
VAR_1 = VAR_1.filter(FUNCTION_1);

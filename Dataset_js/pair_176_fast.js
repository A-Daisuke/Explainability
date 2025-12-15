var VAR_1 = {},
  VAR_2 = ["a", "b", "c", "d", "e"],
  VAR_11 = VAR_2.length,
  VAR_3 = { KEY_1: { KEY_2: { KEY_3: { KEY_4: { KEY_5: 1 } } } } },
  VAR_4 = {};
function FUNCTION_1(VAR_6) {
  if (VAR_6 == null) {
    return VAR_1;
  }
  var VAR_12 = "",
    VAR_13 = 0,
    VAR_14 = VAR_11;
  while (((VAR_12 = VAR_2[VAR_13]), VAR_13++ < VAR_14)) {
    if (VAR_6 == null) {
      return VAR_1;
    }
    VAR_6 = VAR_6[VAR_12];
  }
  return VAR_6 === undefined ? VAR_1 : VAR_6;
}
FUNCTION_1(VAR_4);

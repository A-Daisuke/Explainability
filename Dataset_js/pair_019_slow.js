function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  var VAR_4 = VAR_2 === "" ? [] : VAR_2.split(".");
  if (VAR_1 === undefined || VAR_1 === null) {
    return VAR_3;
  }
  if (VAR_4.length === 0) {
    return VAR_1;
  }
  var VAR_5 = isNaN(VAR_4[0]) ? VAR_4[0] : parseInt(VAR_4[0]);
  var VAR_6 = VAR_1[VAR_5];
  var VAR_7 = VAR_4.slice(1).join(".");
  return FUNCTION_1(VAR_6, VAR_7, VAR_3);
}
FUNCTION_1(
  {
    KEY_1: {
      KEY_2: {
        KEY_3: "Antonio",
        KEY_4: 12,
      },
    },
  },
  "response.body",
  [],
);

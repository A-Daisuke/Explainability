function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  var VAR_4 = VAR_2.split(".");
  if (!VAR_1) {
    return VAR_3;
  }
  var VAR_8 = 0,
    VAR_9,
    VAR_10 = VAR_4.length;
  VAR_4.map(function (VAR_11) {
    if (VAR_8 > VAR_10) {
      return VAR_9;
    }
    VAR_9 = VAR_1[VAR_11];
    VAR_8++;
  });
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

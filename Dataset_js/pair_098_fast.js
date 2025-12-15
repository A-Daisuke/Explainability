FUNCTION_2 = function (VAR_3) {
  return VAR_3.KEY_1 + VAR_3.KEY_2 + VAR_3.KEY_3;
};
for (var VAR_1 = 0; VAR_1 < 1000; VAR_1++) {
  var VAR_2 = {
    KEY_1: Math.random(),
    KEY_2: "string",
    KEY_3: 123,
  };
  FUNCTION_2(VAR_2);
}

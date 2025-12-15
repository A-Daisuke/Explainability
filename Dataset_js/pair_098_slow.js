for (var VAR_1 = 0; VAR_1 < 1000; VAR_1++) {
  var VAR_2 = {
    KEY_1: Math.random(),
    KEY_2: "string",
    KEY_3: 123,
  };
  var FUNCTION_1 = function () {
    return VAR_2.KEY_1 + VAR_2.KEY_2 + VAR_2.KEY_3;
  };
  FUNCTION_1();
}

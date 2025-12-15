function FUNCTION_1(VAR_1) {
  if (VAR_1.length < 2) {
    return [];
  }
  var VAR_2 = VAR_1[0],
    VAR_3 = VAR_1.slice(1),
    VAR_4 = VAR_3.map(function (VAR_5) {
      return [VAR_2, VAR_5];
    });
  return VAR_4.concat(FUNCTION_1(VAR_3));
}
FUNCTION_1(["a", "b", "c", "d", "e", "f", "g"]);

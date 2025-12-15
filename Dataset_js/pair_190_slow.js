function FUNCTION_1() {
  var VAR_1 = ["f"];
  function FUNCTION_2(VAR_2) {
    VAR_1.push(VAR_2);
    return VAR_1.join("");
  }
  if (arguments[0]) {
    return FUNCTION_2(arguments[0]);
  } else {
    VAR_1.push("o");
  }
  return function word() {
    if (arguments[0]) {
      return FUNCTION_2(arguments[0]);
    } else {
      VAR_1.push("o");
      return word;
    }
  };
}

function FUNCTION_1(VAR_1) {
  switch (VAR_1.charAt(0)) {
    case "f":
      if (VAR_1 === "foo") return true;
      break;
    case "b":
      if (VAR_1 === "bar") return true;
      break;
    default:
  }
  return false;
}
var VAR_2 = ["678", "foo", "bar", "1234"];
function FUNCTION_2(VAR_3) {
  return VAR_2.indexOf(VAR_3) !== -1;
}
FUNCTION_1("foo");
FUNCTION_1("bar");
FUNCTION_1("xyz");
FUNCTION_1("baz");
FUNCTION_1("quux");
FUNCTION_1("far");

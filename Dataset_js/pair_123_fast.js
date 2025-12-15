var VAR_1 = /[a-z]/gi;
function FUNCTION_1(VAR_3) {
  switch (VAR_3) {
    case "a":
      return "1";
    case "b":
      return "2";
    case "c":
      return "3";
    case "d":
      return "4";
    case "e":
      return "5";
    case "f":
      return "6";
    case "g":
      return "7";
    default:
      return "0";
  }
}
"abcdefg".replace(VAR_1, FUNCTION_1);

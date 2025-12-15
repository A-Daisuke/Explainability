function FUNCTION_1(VAR_1) {
  var VAR_2;
  if (typeof VAR_1 === "string") {
    VAR_2 = VAR_1;
  }
}
function FUNCTION_2(VAR_3) {
  var VAR_4;
  if (Object.prototype.toString.apply(VAR_3) === "[object String]") {
    VAR_4 = VAR_3;
  }
}
function FUNCTION_3(VAR_5) {
  var VAR_6;
  VAR_6 = VAR_5;
}
VAR_7 = 1000000000;
FUNCTION_2("Lorem Ipsum");

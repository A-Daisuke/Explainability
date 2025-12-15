function FUNCTION_1(VAR_1, VAR_2) {
  var VAR_3 = "";
  do {
    if (VAR_2 & 1) {
      VAR_3 += VAR_1;
    }
    VAR_1 += VAR_1;
  } while ((VAR_2 = VAR_2 >> 1));
  return VAR_3;
}
function FUNCTION_3(VAR_6) {
  VAR_6;
}
FUNCTION_3("Hello world!".repeat(1000));

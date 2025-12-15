function FUNCTION_1(VAR_1) {
  var VAR_2 = VAR_1 || "";
  var VAR_3 =
    typeof VAR_2 == "string" ? VAR_2.split("") : VAR_2;
  VAR_3.sort(function (VAR_4, VAR_5) {
    return VAR_4.charCodeAt(0) - VAR_5.charCodeAt(0);
  });
  return VAR_3.join("").replace(/(.)\1+/g, "$1");
}
FUNCTION_1("foo");

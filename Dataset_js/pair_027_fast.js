var VAR_6 = Math.sqrt(5),
  VAR_7 = (1 + VAR_6) / 2,
  VAR_8 = (1 - VAR_6) / 2;
function FUNCTION_1(VAR_1) {
  return Math.round((Math.pow(VAR_7, VAR_1) + Math.pow(VAR_8, VAR_1)) / VAR_6 + 0.08);
}
function FUNCTION_3(VAR_5) {
  if (VAR_5 == 1 || VAR_5 == 2) return 1;
  else return FUNCTION_3(VAR_5 - 1) + FUNCTION_3(VAR_5 - 2);
}
FUNCTION_1(999);

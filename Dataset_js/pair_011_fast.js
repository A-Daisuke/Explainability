function FUNCTION_1(VAR_1, VAR_2) {
  return [VAR_1 >>> 0, VAR_2 >>> 0];
}
function FUNCTION_2(VAR_5, VAR_6) {
  return {
    KEY_1: VAR_5 >>> 0,
    KEY_2: VAR_6 >>> 0,
  };
}
FUNCTION_1(255, 0);

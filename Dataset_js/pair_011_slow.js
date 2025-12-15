function FUNCTION_1(VAR_1, VAR_2) {
  this.VAR_3 = VAR_1 >>> 0;
  this.VAR_4 = VAR_2 >>> 0;
}
function FUNCTION_2(VAR_5, VAR_6) {
  return {
    KEY_1: VAR_5 >>> 0,
    KEY_2: VAR_6 >>> 0,
  };
}
new FUNCTION_1(255, 0);

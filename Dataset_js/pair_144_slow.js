function FUNCTION_1(VAR_1, VAR_2, VAR_3, VAR_4, VAR_5) {
  this.VAR_6 = VAR_1;
  this.VAR_7 = VAR_2;
  this.VAR_8 = VAR_3;
  this.VAR_9 = VAR_4;
  this.VAR_10 = VAR_5;
}
FUNCTION_1.prototype.FUNCTION_2 = function () {
  return this.VAR_7;
};
FUNCTION_1.prototype.FUNCTION_3 = function () {
  return (
    this.VAR_6 +
    ", " +
    this.VAR_7 +
    ", " +
    this.VAR_8 +
    ", " +
    this.VAR_9 +
    ", " +
    this.VAR_10
  );
};

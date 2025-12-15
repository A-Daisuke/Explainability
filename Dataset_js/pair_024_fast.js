function FUNCTION_2() {
  this.VAR_5 = new ArrayBuffer(1000);
  this.VAR_6 = new Int8Array(this.VAR_5);
}
function FUNCTION_1() {
  this.VAR_5 = new ArrayBuffer(1000);
  this.VAR_6 = new Int8Array(this.VAR_5);
  this.VAR_3 = new Uint8Array(this.VAR_5);
}
new FUNCTION_2();

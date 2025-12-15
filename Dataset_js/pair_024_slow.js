function FUNCTION_1() {
  this.VAR_1 = new ArrayBuffer(1000);
  this.VAR_2 = new Int8Array(this.VAR_1);
  this.VAR_3 = new Uint8Array(this.VAR_1);
}
function FUNCTION_2() {
  this.VAR_1 = new ArrayBuffer(1000);
  this.VAR_2 = new Int8Array(this.VAR_1);
  this.VAR_3 = new Uint8Array(this.VAR_1);
  this.VAR_4 = new Int16Array(this.VAR_1);
}
new FUNCTION_2();

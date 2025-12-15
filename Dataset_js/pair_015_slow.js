var VAR_1 = 1024 * 32;
var VAR_2 = 3 * 1024;
var VAR_3 = new ArrayBuffer(VAR_1);
var VAR_4 = new Uint32Array(VAR_3, 0, VAR_2);
var VAR_5 = new Uint8Array(VAR_3, 0, VAR_2 * 4);
var VAR_6 = 0;
while (VAR_6 < VAR_2) {
  VAR_4[VAR_6++] = Math.random() * (1 << 16);
  VAR_4[VAR_6++] = Math.random() * (1 << 32);
  VAR_4[VAR_6++] = Math.random() * (1 << 32);
}
Array.prototype.join.call(VAR_5, ",");

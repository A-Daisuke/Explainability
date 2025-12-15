var VAR_1 = [0, 0];
var VAR_2 = [5];
var VAR_3 = new ArrayBuffer(100);
var VAR_4 = new Int32Array(VAR_3);
var VAR_5;
var VAR_6;
for (VAR_6 = 0; VAR_6 < 1000; VAR_6++) {
  VAR_4[0 | 0] = 5;
  VAR_4[0 | 0] = VAR_4[0 | 0] + 1;
  VAR_4[3 | 0] = VAR_4[2 | 0] + 1;
  VAR_4[4 | 0] = VAR_4[0 | 0];
  VAR_4[5 | 0] = VAR_4[3 | 0] + VAR_4[4 | 0];
  VAR_4[6 | 0] = VAR_4[5 | 0] + VAR_4[2 | 0];
}

var VAR_1 = {
  KEY_1: 0,
  KEY_2: 0,
};
var VAR_2 = {
  KEY_3: 0,
  KEY_4: 1,
};
var VAR_3 = {
  KEY_5: 0,
  KEY_6: 1,
};
var VAR_4 = {
  KEY_7: 0,
  KEY_8: 1,
};
var VAR_5 = 1 / 60;
if (VAR_3.KEY_1 !== 0) {
  VAR_1.KEY_1 += VAR_3.KEY_1 * VAR_5;
}
if (VAR_2.KEY_1 !== 0) {
  VAR_1.KEY_1 += VAR_2.KEY_1 * VAR_5;
} else if (VAR_4.KEY_1 !== 0) {
  VAR_1.KEY_1 -= VAR_4.KEY_1 * VAR_5;
}

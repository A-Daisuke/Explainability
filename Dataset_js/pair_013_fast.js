const VAR_1 = Array(1000).fill({
  KEY_1: "kyle",
  KEY_2: "fdjis@fido.com",
  KEY_3: "dingo",
});
const VAR_4 = Array(VAR_1.length * 3);
let VAR_5 = 0;
for (let VAR_6 = 0; VAR_6 < VAR_1.length; VAR_6++) {
  let { VAR_7, VAR_8, VAR_9 } = VAR_1[VAR_6];
  if (VAR_7) VAR_4[VAR_5++] = VAR_7;
  if (VAR_8) VAR_4[VAR_5++] = VAR_8;
  if (VAR_9) VAR_4[VAR_5++] = VAR_9;
}
VAR_10 = VAR_1.slice(0, VAR_5);

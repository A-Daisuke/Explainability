let VAR_1 = [];
for (let VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
  VAR_1.push({
    KEY_1: VAR_2 / 100,
    KEY_2: Math.random(),
  });
}
let VAR_3 = VAR_1.slice();
let VAR_4 = 0;
while (VAR_3[VAR_4].KEY_1 < 5) VAR_4++;
VAR_3.splice(0, VAR_4);
if (VAR_3.length !== 500) throw new Error();

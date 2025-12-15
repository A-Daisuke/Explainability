var VAR_1 = [];
for (VAR_2 = 0; VAR_2 < 100000; VAR_2++)
  VAR_1.push({
    KEY_1: 1,
    KEY_2: "2",
  });
var VAR_3 = VAR_1.slice();
while (VAR_3.length > 0) {
  VAR_3.shift();
}

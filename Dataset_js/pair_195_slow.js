var VAR_1 = [];
var VAR_2 = 10000;
for (var VAR_3 = 0; VAR_3 < VAR_2; VAR_3++) {
  VAR_1.push(Math.floor(Math.random() * 100));
}
var VAR_4 = [];
var VAR_5 = [];
for (var VAR_6 = 0; VAR_3 < VAR_2; VAR_3++) {
  if (VAR_1[VAR_3] % 2 === 0) {
    VAR_4.push(VAR_1[VAR_3]);
  } else {
    VAR_5.push(VAR_1[VAR_3]);
  }
}

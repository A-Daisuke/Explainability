var VAR_1 = [];
var VAR_2 = 0;
var VAR_3 = 1000;
for (var VAR_4 = 0; VAR_4 < 1024; VAR_4++) {
  VAR_1.push(Math.floor(Math.random() * (VAR_3 - VAR_2)) + VAR_2);
}
var VAR_5 = [];
var VAR_6 = [];
var VAR_7 = VAR_1.slice();
while (VAR_7.length) {
  var VAR_8 = VAR_7.shift();
  if (VAR_5.indexOf(VAR_8) === -1) {
    VAR_5.push(VAR_8);
    if (VAR_7.indexOf(VAR_8) === -1) {
      VAR_6.push(VAR_8);
    }
  }
}

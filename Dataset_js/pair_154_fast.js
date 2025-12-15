var VAR_1 = [
  ["1,2,3", 100, 50],
  ["4,5", 75, 10],
  ["6", 20, 90],
];
var VAR_2 = [];
for (var VAR_8 in VAR_1) {
  var VAR_9 = VAR_1[VAR_8];
  var VAR_10 = VAR_9[0].split(",");
  for (var VAR_11 in VAR_10) {
    var VAR_12 = VAR_10[VAR_11];
    VAR_2.push([VAR_12, VAR_9[1] / VAR_10.length, VAR_9[2] / VAR_10.length]);
  }
}

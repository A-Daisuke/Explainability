var VAR_1 = [
  ["1,2,3", 100, 50],
  ["4,5", 75, 10],
  ["6", 20, 90],
];
var VAR_2 = VAR_1.reduce(function (VAR_3, VAR_4) {
  return VAR_3.concat(
    VAR_4[0].split(",").map(function (VAR_5, VAR_6, VAR_7) {
      return [VAR_5, VAR_4[1] / VAR_7.length, VAR_4[2] / VAR_7.length];
    }),
  );
}, []);

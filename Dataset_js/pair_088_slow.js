const VAR_1 = {};
VAR_1.VAR_2 = [];
VAR_3 = [];
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8],
  [9, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 0],
  null,
  null,
].forEach((VAR_4) => VAR_3.push(VAR_4));
VAR_1.VAR_5 = VAR_3.reduce((VAR_6, VAR_7) => VAR_6.concat(VAR_7), []);

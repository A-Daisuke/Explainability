const VAR_1 = Array(1000)
  .fill(1)
  .map((VAR_2, VAR_3) => ({
    KEY_1: VAR_3,
    KEY_2: VAR_3 ** Math.random(),
    KEY_3: VAR_3 ** Math.random(),
  }));
const VAR_4 = VAR_1.reduce((VAR_5, VAR_6) => {
  VAR_5[VAR_6.KEY_1] = VAR_6;
  return VAR_5;
}, {});

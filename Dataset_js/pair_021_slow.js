function FUNCTION_1(VAR_1) {
  const VAR_2 = 1.61803398875;
  const VAR_3 = [1, 1, 2];
  let VAR_4 = 0;
  let VAR_5 = VAR_3[VAR_3.length - 1];
  let VAR_6 = [];
  while (VAR_4 < VAR_3.length) {
    VAR_6.push(VAR_3[VAR_4]);
    VAR_4++;
  }
  while (VAR_4 < VAR_1) {
    VAR_5 = Math.round(VAR_5 * VAR_2);
    VAR_6.push(VAR_5);
    VAR_4++;
  }
  return VAR_6;
}
FUNCTION_1(10);

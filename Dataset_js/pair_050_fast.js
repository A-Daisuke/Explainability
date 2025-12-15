function FUNCTION_2(VAR_4) {
  return VAR_4.reduce((VAR_5, VAR_6) => VAR_5.concat(VAR_6), []);
}
function FUNCTION_1(VAR_1) {
  let VAR_11 = [];
  for (const VAR_12 of VAR_1) VAR_11 = VAR_11.concat(VAR_12);
  return VAR_11;
}
function FUNCTION_3(VAR_7) {
  let VAR_8 = [];
  for (const VAR_9 of VAR_7) VAR_8 = [...VAR_8, ...VAR_9];
  return VAR_8;
}
const VAR_10 = [[], [1, 23], [1, 41, 42]];
FUNCTION_1(VAR_10);

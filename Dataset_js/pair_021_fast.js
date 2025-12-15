function FUNCTION_1(VAR_1) {
  let VAR_2 = 0;
  let VAR_4 = 1;
  let VAR_7;
  let VAR_6 = [];
  for (let VAR_8 = 0; VAR_8 < VAR_1; VAR_8++) {
    VAR_7 = VAR_4 + VAR_2;
    VAR_4 = VAR_2;
    VAR_2 = VAR_7;
    VAR_6.push(VAR_2);
  }
  return VAR_6;
}
FUNCTION_1(10);

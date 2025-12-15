function FUNCTION_1(VAR_1) {
  let VAR_2 = 0;
  let VAR_5 = 0;
  let VAR_6 = 1;
  let VAR_7;
  let VAR_3 = [];
  while (VAR_2++ < VAR_1) {
    VAR_7 = VAR_6 + VAR_5;
    VAR_6 = VAR_5;
    VAR_5 = VAR_7;
    VAR_3.push(VAR_5);
  }
  return VAR_3;
}
FUNCTION_1(10);

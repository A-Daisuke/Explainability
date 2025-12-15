const VAR_1 = [];
for (let VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
  VAR_1.push(VAR_2);
}
function FUNCTION_1(VAR_3, VAR_4) {
  const VAR_6 = [];
  for (const VAR_7 of VAR_3) {
    FUNCTION_2(VAR_7) ? VAR_6.push(VAR_7) : void 0;
  }
  return VAR_6;
}
const FUNCTION_2 = (VAR_5) => VAR_5 % 2 === 0;
FUNCTION_1(VAR_1, FUNCTION_2);

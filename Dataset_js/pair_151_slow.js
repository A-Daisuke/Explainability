const VAR_1 = [];
for (let VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
  VAR_1.push(VAR_2);
}
function FUNCTION_1(VAR_3, VAR_4) {
  if (Array.isArray(VAR_3)) {
    return VAR_3.filter(VAR_4);
  }
  return Array.from(VAR_3).filter(VAR_4);
}
const FUNCTION_2 = (VAR_5) => VAR_5 % 2 === 0;
FUNCTION_1(VAR_1, FUNCTION_2);

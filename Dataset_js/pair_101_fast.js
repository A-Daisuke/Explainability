function FUNCTION_1() {
  let VAR_1 = Math.random() * 1000;
  if (VAR_1 % 2 === 0) return undefined;
  return VAR_1;
}
let VAR_2 = new Array(100000);
VAR_2.fill(FUNCTION_1());
let VAR_3 = Array.length;
let VAR_4 = VAR_2.reduce((VAR_6, VAR_7) => {
  return VAR_6 + VAR_7;
}, 0);
console.log(VAR_4);

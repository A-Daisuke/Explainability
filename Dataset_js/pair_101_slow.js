function FUNCTION_1() {
  let VAR_1 = Math.random() * 1000;
  if (VAR_1 % 2 === 0) return undefined;
  return VAR_1;
}
let VAR_2 = new Array(100000);
VAR_2.fill(FUNCTION_1());
let VAR_3 = Array.length;
let VAR_4 = 0;
VAR_2.forEach((VAR_5) => {
  VAR_4 = VAR_4 + VAR_5;
});
console.log(VAR_4);

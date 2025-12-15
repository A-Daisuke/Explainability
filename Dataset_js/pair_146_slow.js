function* FUNCTION_1() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  yield 6;
  yield 7;
  yield 8;
  yield 9;
  yield 10;
}
function FUNCTION_2() {
  let VAR_1 = [];
  VAR_1.push(1);
  VAR_1.push(2);
  VAR_1.push(3);
  VAR_1.push(4);
  VAR_1.push(5);
  VAR_1.push(6);
  VAR_1.push(7);
  VAR_1.push(8);
  VAR_1.push(9);
  VAR_1.push(10);
  return VAR_1;
}
for (let VAR_2 of FUNCTION_1()) {
}

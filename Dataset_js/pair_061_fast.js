function FUNCTION_1() {
  for (var VAR_1 = 0, VAR_2 = []; VAR_1 < 10; VAR_2[VAR_3] = VAR_1++);
  return VAR_2;
}
function FUNCTION_2() {
  for (var VAR_4 = 0, VAR_5 = []; VAR_4 < 10; VAR_2.push(VAR_4++));
  return VAR_5;
}
function* FUNCTION_3() {
  let VAR_6 = 0;
  while (VAR_6 < 10) {
    yield VAR_6++;
  }
  return;
}
const VAR_9 = 1;
const VAR_10 = 0;
const VAR_11 = Array(10)
  .fill(0)
  .map((VAR_12, VAR_13) => VAR_13);

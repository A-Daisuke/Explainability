function FUNCTION_1(VAR_1) {
  VAR_1 = Number(VAR_1) + 1000000;
  var VAR_2 = 0,
    VAR_3 = 0;
  if (VAR_1 > 1999999) return false;
  VAR_2 += VAR_1 % 10;
  VAR_1 = Math.floor(VAR_1 / 10);
  VAR_2 += VAR_1 % 10;
  VAR_1 = Math.floor(VAR_1 / 10);
  VAR_2 += VAR_1 % 10;
  VAR_1 = Math.floor(VAR_1 / 10);
  VAR_3 += VAR_1 % 10;
  VAR_1 = Math.floor(VAR_1 / 10);
  VAR_3 += VAR_1 % 10;
  VAR_1 = Math.floor(VAR_1 / 10);
  VAR_3 += VAR_1 % 10;
  return VAR_2 == VAR_3;
}
FUNCTION_1("123123");

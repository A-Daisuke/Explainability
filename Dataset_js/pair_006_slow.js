function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
  return VAR_3 === 0 ? VAR_1 : FUNCTION_1(VAR_2 + VAR_1, VAR_2, --VAR_3);
}
function FUNCTION_2(VAR_4, VAR_5, VAR_6) {
  if (VAR_6 === 0) return VAR_4;
  VAR_4 = VAR_5 + VAR_4;
  return FUNCTION_2(VAR_4, VAR_5, --VAR_6);
}
function FUNCTION_3(VAR_7, VAR_8, VAR_9) {
  return (
    Array.apply(null, Array(VAR_9))
      .map(function (VAR_10) {
        return VAR_8;
      })
      .join("") + VAR_7
  );
}
FUNCTION_3("a", "x", 1000);

function FUNCTION_1(VAR_1) {
  return encodeURIComponent((VAR_1 + "").toString()).replace(
    /[!'\(\)\*]/g,
    function (VAR_5) {
      return "%" + VAR_5.charCodeAt(0).toString(16).toUpperCase();
    },
  );
}
function FUNCTION_2(VAR_2, VAR_3, VAR_4) {
  while (VAR_4--) {
    VAR_2(VAR_3);
  }
}
FUNCTION_2(FUNCTION_1, "!'()*", 100);

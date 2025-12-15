(function () {
  var VAR_2 = new Array(7000 * 7);
  for (var VAR_3 = 0; VAR_3 < 7000; VAR_3++) {
    VAR_2[VAR_3++] = "Quick ";
    VAR_2[VAR_3++] = VAR_3;
    VAR_2[VAR_3++] = " fox ";
    VAR_2[VAR_3++] = VAR_3;
    VAR_2[VAR_3++] = " over the ";
    VAR_2[VAR_3++] = VAR_3;
    VAR_2[VAR_3++] = " dog. ";
  }
  VAR_2.join("");
})();

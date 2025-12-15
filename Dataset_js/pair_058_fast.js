var VAR_10 = [];
(function () {
  var VAR_11 = 100;
  while (VAR_11) {
    VAR_10.push(VAR_11);
    --VAR_11;
  }
})();
var VAR_12;
for (VAR_11 = 0; VAR_11 < VAR_10.length; ++VAR_11) {
  if (VAR_10[VAR_11] === "a") {
    throw "Error";
  }
}

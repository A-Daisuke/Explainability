var VAR_1 = {},
  VAR_2 = ["a", "b", "c", "d", "e"],
  VAR_3 = { KEY_1: { KEY_2: { KEY_3: { KEY_4: { KEY_5: 1 } } } } },
  VAR_4 = {};
var VAR_5 = {};
function FUNCTION_1(VAR_6) {
  var VAR_7 = VAR_2.reduce(function (VAR_8, VAR_9) {
    if (VAR_6 == null || VAR_6 === VAR_5) return VAR_5;
    var VAR_10 = VAR_6[VAR_9];
    return VAR_10 == null ? VAR_5 : VAR_10;
  }, VAR_6);
  return VAR_7 === VAR_5 ? VAR_1 : VAR_7;
}
FUNCTION_1(VAR_4);

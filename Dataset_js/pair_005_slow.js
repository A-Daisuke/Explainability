var VAR_1 =
  "this    is              a a  a a    a a a  a  aaaa       aa a   aa a  a a  a  a    a  a  a  a  a a  a        a  a a  a a          a a a   a  a                             a a  a a a a  a  a  a    a  a  a a a a a a a a a a a a a a   a  a  a  a  a  a     a  a   a  a test.";
function FUNCTION_1(VAR_2) {
  VAR_2 = VAR_2.trim().split(" ");
  var VAR_3 = [];
  for (var VAR_4 = 0; VAR_4 < VAR_2.length; VAR_4++) {
    if (VAR_2[VAR_4]) {
      VAR_3.push(VAR_2[VAR_4]);
    }
  }
  return VAR_3.join(" ");
}
var VAR_5 = VAR_1.replace(/ +/g, " ");

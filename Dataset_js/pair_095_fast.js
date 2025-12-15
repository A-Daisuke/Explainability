var VAR_1 = Array(1000);
VAR_1[304] = "foo";
VAR_1[400] = "bar";
VAR_1[700] = "bar";
var VAR_5,
  VAR_4 = "";
for (VAR_5 in VAR_1) {
  if (isNaN(VAR_5)) continue;
  VAR_4 += VAR_1[VAR_5];
}

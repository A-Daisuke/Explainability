var VAR_1 = Array(1000);
VAR_1[304] = "foo";
VAR_1[400] = "bar";
VAR_1[700] = "bar";
var VAR_2 = 0,
  VAR_3 = VAR_1.length,
  VAR_4 = "";
for (; VAR_2 < VAR_3; VAR_2++) {
  if (VAR_2 in VAR_1) {
    VAR_4 += VAR_1[VAR_2];
  }
}

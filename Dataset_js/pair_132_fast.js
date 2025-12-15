function FUNCTION_1(VAR_1) {
  var VAR_2 = /aa/g,
    VAR_7 = /ab/g,
    VAR_8 = "aab,",
    VAR_3 = [],
    VAR_4;
  VAR_2.VAR_5 = VAR_7.VAR_9 = 0;
  while ((VAR_4 = VAR_2.exec(VAR_1))) {
    VAR_3.push(VAR_4[0]);
  }
  while ((VAR_4 = VAR_7.exec(VAR_1))) {
    VAR_3.push(VAR_4[0]);
  }
  return VAR_3;
}
FUNCTION_1(
  "aaaaaa42aaaaaaaabbbbabbabbbbbbbbaaababababbbbaaaa-------------------------foobar------------ab----aaa,a",
);

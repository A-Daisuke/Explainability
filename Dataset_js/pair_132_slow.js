function FUNCTION_1(VAR_1) {
  var VAR_2 = /(aa|ab)/g,
    VAR_3 = [],
    VAR_4;
  VAR_2.VAR_5 = 0;
  while ((VAR_4 = VAR_2.exec(VAR_1))) {
    VAR_3.push(VAR_4[0]);
    VAR_2.VAR_6 -= VAR_4[0].length - 1;
  }
  return VAR_3;
}
FUNCTION_1(
  "aaaaaa42aaaaaaaabbbbabbabbbbbbbbaaababababbbbaaaa-------------------------foobar------------ab----aaa,a",
);

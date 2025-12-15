var VAR_1 = [
  "aaa",
  "aaa/aaa",
  "aaa/aaa/aaa",
  "aaa/",
  "/aaa",
  "aaa//aaa",
  "//////",
  "",
];
VAR_1.map(function (VAR_2) {
  return VAR_2.match(/(\u002f)/) ? VAR_2.substring(0, VAR_2.indexOf("/")) : VAR_2;
});

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
  return VAR_2.replace(/\/.*$/, "");
});

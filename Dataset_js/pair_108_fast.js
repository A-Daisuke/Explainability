var VAR_1 = [
  ".springer.com",
  ".springernature.com",
  ".springernature.app",
  ".biomedcentral.com",
  ".springeropen.com",
];
function FUNCTION_1(VAR_2) {
  var VAR_5 = false;
  VAR_1.forEach(function (VAR_6) {
    if (VAR_6.indexOf(VAR_2) >= 0) {
      VAR_5 = true;
    }
  });
  return VAR_5;
}
FUNCTION_1("https://genomebiology.biomedcentral.com");

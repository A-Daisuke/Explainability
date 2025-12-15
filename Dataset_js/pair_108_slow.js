var VAR_1 = [
  ".springer.com",
  ".springernature.com",
  ".springernature.app",
  ".biomedcentral.com",
  ".springeropen.com",
];
function FUNCTION_1(VAR_2) {
  return VAR_1.some(function (VAR_3) {
    var VAR_4 = new RegExp("(" + VAR_3 + ")");
    return VAR_4.test(VAR_2);
  });
}
FUNCTION_1("https://genomebiology.biomedcentral.com");

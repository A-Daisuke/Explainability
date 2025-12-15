function FUNCTION_1(VAR_1) {
  return VAR_1;
}
const VAR_2 = FUNCTION_1.bind(undefined, 13);
const FUNCTION_2 = () => FUNCTION_1(13);
const VAR_3 = {
  KEY_1() {
    FUNCTION_1(13);
  },
  KEY_2() {
    VAR_2();
  },
  KEY_3() {
    FUNCTION_2();
  },
};
VAR_3.KEY_3();

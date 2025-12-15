const VAR_1 = Array(1000).fill({
  KEY_1: "kyle",
  KEY_2: "fdjis@fido.com",
  KEY_3: "dingo",
});
const VAR_2 = [];
VAR_1.forEach((VAR_3) => {
  if (VAR_3.KEY_1) VAR_2.push(VAR_3.KEY_1);
  if (VAR_3.KEY_2) VAR_2.push(VAR_3.KEY_2);
  if (VAR_3.KEY_3) VAR_2.push(VAR_3.KEY_3);
});

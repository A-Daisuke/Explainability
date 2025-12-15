var VAR_1 = undefined;
try {
  if (Math.random() > 0.01) {
    VAR_1 = +new Date();
  } else {
    throw Error();
  }
} catch (VAR_2) {
  VAR_1 = null;
}

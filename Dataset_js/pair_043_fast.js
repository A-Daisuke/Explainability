var VAR_1 = undefined;
try {
  if (Math.random() > 1e-20) {
    VAR_1 = +new Date();
  } else {
    throw Error();
  }
} catch (VAR_2) {
  VAR_1 = null;
}

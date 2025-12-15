var VAR_1 = {
  KEY_1: function () {
    if (this instanceof VAR_1.KEY_1)
      return VAR_1.KEY_1.apply(document, arguments);
    return this;
  },
  KEY_2: function () {
    if (this.constructor === VAR_1.KEY_2)
      return VAR_1.KEY_2.apply(document, arguments);
    return this;
  },
  KEY_3: function () {
    return this;
  },
};
VAR_1.KEY_2() === VAR_1;

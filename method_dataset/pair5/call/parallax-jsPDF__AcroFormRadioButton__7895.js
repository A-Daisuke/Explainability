var AcroFormRadioButton = function AcroFormRadioButton() {
  AcroFormButton.call(this);
  this.radio = true;
  this.pushButton = false;
  var _Kids = [];
  Object.defineProperty(this, "Kids", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return _Kids;
    },
    set: function set(value) {
      if (typeof value !== "undefined") {
        _Kids = value;
      } else {
        _Kids = [];
      }
    }
  });
};

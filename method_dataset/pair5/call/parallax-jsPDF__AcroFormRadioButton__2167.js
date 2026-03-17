var AcroFormRadioButton = function() {
  AcroFormButton.call(this);
  this.radio = true;
  this.pushButton = false;

  var _Kids = [];
  Object.defineProperty(this, "Kids", {
    enumerable: true,
    configurable: false,
    get: function() {
      return _Kids;
    },
    set: function(value) {
      if (typeof value !== "undefined") {
        _Kids = value;
      } else {
        _Kids = [];
      }
    }
  });
};

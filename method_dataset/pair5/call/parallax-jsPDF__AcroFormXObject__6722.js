  var AcroFormXObject = function AcroFormXObject() {
    AcroFormPDFObject.call(this);
    Object.defineProperty(this, "Type", {
      value: "/XObject",
      configurable: false,
      writable: true
    });
    Object.defineProperty(this, "Subtype", {
      value: "/Form",
      configurable: false,
      writable: true
    });
    Object.defineProperty(this, "FormType", {
      value: 1,
      configurable: false,
      writable: true
    });
    var _BBox = [];
    Object.defineProperty(this, "BBox", {
      configurable: false,
      get: function get() {
        return _BBox;
      },
      set: function set(value) {
        _BBox = value;
      }
    });
    Object.defineProperty(this, "Resources", {
      value: "2 0 R",
      configurable: false,
      writable: true
    });
    var _stream;
    Object.defineProperty(this, "stream", {
      enumerable: false,
      configurable: true,
      set: function set(value) {
        _stream = value.trim();
      },
      get: function get() {
        if (_stream) {
          return _stream;
        } else {
          return null;
        }
      }
    });
  };

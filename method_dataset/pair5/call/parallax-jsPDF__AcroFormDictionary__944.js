var AcroFormDictionary = function() {
  AcroFormPDFObject.call(this);

  var _Kids = [];

  Object.defineProperty(this, "Kids", {
    enumerable: false,
    configurable: true,
    get: function() {
      if (_Kids.length > 0) {
        return _Kids;
      } else {
        return undefined;
      }
    }
  });
  Object.defineProperty(this, "Fields", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _Kids;
    }
  });

  // Default Appearance
  var _DA;
  Object.defineProperty(this, "DA", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (!_DA) {
        return undefined;
      }
      var encryptor = function(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      return "(" + pdfEscape(encryptor(_DA)) + ")";
    },
    set: function(value) {
      _DA = value;
    }
  });
};

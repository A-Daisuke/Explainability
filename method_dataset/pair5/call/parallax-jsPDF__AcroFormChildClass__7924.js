var AcroFormChildClass = function AcroFormChildClass() {
  AcroFormField.call(this);
  var _parent;
  Object.defineProperty(this, "Parent", {
    enumerable: false,
    configurable: false,
    get: function get() {
      return _parent;
    },
    set: function set(value) {
      _parent = value;
    }
  });
  var _optionName;
  Object.defineProperty(this, "optionName", {
    enumerable: false,
    configurable: true,
    get: function get() {
      return _optionName;
    },
    set: function set(value) {
      _optionName = value;
    }
  });
  var _MK = {};
  Object.defineProperty(this, "MK", {
    enumerable: false,
    configurable: false,
    get: function get() {
      var encryptor = function encryptor(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      var result = [];
      result.push("<<");
      var key;
      for (key in _MK) {
        result.push("/" + key + " (" + pdfEscape(encryptor(_MK[key])) + ")");
      }
      result.push(">>");
      return result.join("\n");
    },
    set: function set(value) {
      if (_typeof(value) === "object") {
        _MK = value;
      }
    }
  });

  /**
   * From the PDF reference:
   * (Optional, button fields only) The widget annotation's normal caption which shall be displayed when it is not interacting with the user.
   * Unlike the remaining entries listed in this Table which apply only to widget annotations associated with pushbutton fields (see Pushbuttons in 12.7.4.2, "Button Fields"), the CA entry may be used with any type of button field, including check boxes (see Check Boxes in 12.7.4.2, "Button Fields") and radio buttons (Radio Buttons in 12.7.4.2, "Button Fields").
   *
   * - '8' = Cross,
   * - 'l' =  Circle,
   * - '' = nothing
   * @name AcroFormButton#caption
   * @type {string}
   */
  Object.defineProperty(this, "caption", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _MK.CA || "";
    },
    set: function set(value) {
      if (typeof value === "string") {
        _MK.CA = value;
      }
    }
  });
  var _AS;
  Object.defineProperty(this, "AS", {
    enumerable: false,
    configurable: false,
    get: function get() {
      return _AS;
    },
    set: function set(value) {
      _AS = value;
    }
  });

  /**
   * (Required if the appearance dictionary AP contains one or more subdictionaries; PDF 1.2) The annotation's appearance state, which selects the applicable appearance stream from an appearance subdictionary (see Section 12.5.5, "Appearance Streams")
   *
   * @name AcroFormButton#appearanceState
   * @type {any}
   */
  Object.defineProperty(this, "appearanceState", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _AS.substr(1, _AS.length - 1);
    },
    set: function set(value) {
      _AS = "/" + value;
    }
  });
  this.caption = "l";
  this.appearanceState = "Off";
  // todo: set AppearanceType as variable that can be set from the
  // outside...
  this._AppearanceType = AcroFormAppearance.RadioButton.Circle;
  // The Default appearanceType is the Circle
  this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(this.optionName);
};

var AcroFormButton = function AcroFormButton() {
  AcroFormField.call(this);
  this.FT = "/Btn";

  /**
   * (Radio buttons only) If set, exactly one radio button shall be selected at all times; selecting the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.
   *
   * @name AcroFormButton#noToggleToOff
   * @type {boolean}
   */
  Object.defineProperty(this, "noToggleToOff", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 15));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 15);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 15);
      }
    }
  });

  /**
   * If set, the field is a set of radio buttons; if clear, the field is a checkbox. This flag may be set only if the Pushbutton flag is clear.
   *
   * @name AcroFormButton#radio
   * @type {boolean}
   */
  Object.defineProperty(this, "radio", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 16));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 16);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 16);
      }
    }
  });

  /**
   * If set, the field is a pushbutton that does not retain a permanent value.
   *
   * @name AcroFormButton#pushButton
   * @type {boolean}
   */
  Object.defineProperty(this, "pushButton", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 17));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 17);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 17);
      }
    }
  });

  /**
   * (PDF 1.5) If set, a group of radio buttons within a radio button field that use the same value for the on state will turn on and off in unison; that is if one is checked, they are all checked. If clear, the buttons are mutually exclusive (the same behavior as HTML radio buttons).
   *
   * @name AcroFormButton#radioIsUnison
   * @type {boolean}
   */
  Object.defineProperty(this, "radioIsUnison", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 26));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 26);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 26);
      }
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
      if (Object.keys(_MK).length !== 0) {
        var result = [];
        result.push("<<");
        var key;
        for (key in _MK) {
          result.push("/" + key + " (" + pdfEscape(encryptor(_MK[key])) + ")");
        }
        result.push(">>");
        return result.join("\n");
      }
      return undefined;
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
};

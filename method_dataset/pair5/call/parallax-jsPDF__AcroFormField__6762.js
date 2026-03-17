var AcroFormField = function AcroFormField() {
  AcroFormPDFObject.call(this);

  //Annotation-Flag See Table 165
  var _F = 4;
  Object.defineProperty(this, "F", {
    enumerable: false,
    configurable: false,
    get: function get() {
      return _F;
    },
    set: function set(value) {
      if (!isNaN(value)) {
        _F = value;
      } else {
        throw new Error('Invalid value "' + value + '" for attribute F supplied.');
      }
    }
  });

  /**
   * (PDF 1.2) If set, print the annotation when the page is printed. If clear, never print the annotation, regardless of wether is is displayed on the screen.
   * NOTE 2 This can be useful for annotations representing interactive pushbuttons, which would serve no meaningful purpose on the printed page.
   *
   * @name AcroFormField#showWhenPrinted
   * @default true
   * @type {boolean}
   */
  Object.defineProperty(this, "showWhenPrinted", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(_F, 3));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.F = setBitForPdf(_F, 3);
      } else {
        this.F = clearBitForPdf(_F, 3);
      }
    }
  });
  var _Ff = 0;
  Object.defineProperty(this, "Ff", {
    enumerable: false,
    configurable: false,
    get: function get() {
      return _Ff;
    },
    set: function set(value) {
      if (!isNaN(value)) {
        _Ff = value;
      } else {
        throw new Error('Invalid value "' + value + '" for attribute Ff supplied.');
      }
    }
  });
  var _Rect = [];
  Object.defineProperty(this, "Rect", {
    enumerable: false,
    configurable: false,
    get: function get() {
      if (_Rect.length === 0) {
        return undefined;
      }
      return _Rect;
    },
    set: function set(value) {
      if (typeof value !== "undefined") {
        _Rect = value;
      } else {
        _Rect = [];
      }
    }
  });

  /**
   * The x-position of the field.
   *
   * @name AcroFormField#x
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "x", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (!_Rect || isNaN(_Rect[0])) {
        return 0;
      }
      return _Rect[0];
    },
    set: function set(value) {
      _Rect[0] = value;
    }
  });

  /**
   * The y-position of the field.
   *
   * @name AcroFormField#y
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "y", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (!_Rect || isNaN(_Rect[1])) {
        return 0;
      }
      return _Rect[1];
    },
    set: function set(value) {
      _Rect[1] = value;
    }
  });

  /**
   * The width of the field.
   *
   * @name AcroFormField#width
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "width", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (!_Rect || isNaN(_Rect[2])) {
        return 0;
      }
      return _Rect[2];
    },
    set: function set(value) {
      _Rect[2] = value;
    }
  });

  /**
   * The height of the field.
   *
   * @name AcroFormField#height
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "height", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (!_Rect || isNaN(_Rect[3])) {
        return 0;
      }
      return _Rect[3];
    },
    set: function set(value) {
      _Rect[3] = value;
    }
  });
  var _FT = "";
  Object.defineProperty(this, "FT", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return _FT;
    },
    set: function set(value) {
      switch (value) {
        case "/Btn":
        case "/Tx":
        case "/Ch":
        case "/Sig":
          _FT = value;
          break;
        default:
          throw new Error('Invalid value "' + value + '" for attribute FT supplied.');
      }
    }
  });
  var _T = null;
  Object.defineProperty(this, "T", {
    enumerable: true,
    configurable: false,
    get: function get() {
      if (!_T || _T.length < 1) {
        // In case of a Child from a Radio´Group, you don't need a FieldName
        if (this instanceof AcroFormChildClass) {
          return undefined;
        }
        _T = "FieldObject" + AcroFormField.FieldNum++;
      }
      var encryptor = function encryptor(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      return "(" + pdfEscape(encryptor(_T)) + ")";
    },
    set: function set(value) {
      _T = value.toString();
    }
  });

  /**
   * (Optional) The partial field name (see 12.7.3.2, “Field Names”).
   *
   * @name AcroFormField#fieldName
   * @default null
   * @type {string}
   */
  Object.defineProperty(this, "fieldName", {
    configurable: true,
    enumerable: true,
    get: function get() {
      return _T;
    },
    set: function set(value) {
      _T = value;
    }
  });
  var _fontName = "helvetica";
  /**
   * The fontName of the font to be used.
   *
   * @name AcroFormField#fontName
   * @default 'helvetica'
   * @type {string}
   */
  Object.defineProperty(this, "fontName", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _fontName;
    },
    set: function set(value) {
      _fontName = value;
    }
  });
  var _fontStyle = "normal";
  /**
   * The fontStyle of the font to be used.
   *
   * @name AcroFormField#fontStyle
   * @default 'normal'
   * @type {string}
   */
  Object.defineProperty(this, "fontStyle", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _fontStyle;
    },
    set: function set(value) {
      _fontStyle = value;
    }
  });
  var _fontSize = 0;
  /**
   * The fontSize of the font to be used.
   *
   * @name AcroFormField#fontSize
   * @default 0 (for auto)
   * @type {number}
   */
  Object.defineProperty(this, "fontSize", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _fontSize;
    },
    set: function set(value) {
      _fontSize = value;
    }
  });
  var _maxFontSize = undefined;
  /**
   * The maximum fontSize of the font to be used.
   *
   * @name AcroFormField#maxFontSize
   * @default 0 (for auto)
   * @type {number}
   */
  Object.defineProperty(this, "maxFontSize", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (_maxFontSize === undefined) {
        // use the old default value here - the value is some kind of random as it depends on the scaleFactor (user unit)
        // ("50" is transformed to the "user space" but then used in "pdf space")
        return 50 / scaleFactor;
      } else {
        return _maxFontSize;
      }
    },
    set: function set(value) {
      _maxFontSize = value;
    }
  });
  var _color = "black";
  /**
   * The color of the text
   *
   * @name AcroFormField#color
   * @default 'black'
   * @type {string|rgba}
   */
  Object.defineProperty(this, "color", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _color;
    },
    set: function set(value) {
      _color = value;
    }
  });
  var _DA = "/F1 0 Tf 0 g";
  // Defines the default appearance (Needed for variable Text)
  Object.defineProperty(this, "DA", {
    enumerable: true,
    configurable: false,
    get: function get() {
      if (!_DA || this instanceof AcroFormChildClass || this instanceof AcroFormTextField) {
        return undefined;
      }
      return toPdfString(_DA, this.objId, this.scope);
    },
    set: function set(value) {
      value = value.toString();
      _DA = value;
    }
  });
  var _DV = null;
  Object.defineProperty(this, "DV", {
    enumerable: false,
    configurable: false,
    get: function get() {
      if (!_DV) {
        return undefined;
      }
      if (this instanceof AcroFormButton === false) {
        return toPdfString(_DV, this.objId, this.scope);
      }
      return _DV;
    },
    set: function set(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === false) {
        if (value.substr(0, 1) === "(") {
          _DV = pdfUnescape(value.substr(1, value.length - 2));
        } else {
          _DV = pdfUnescape(value);
        }
      } else {
        _DV = value;
      }
    }
  });

  /**
   * (Optional; inheritable) The default value to which the field reverts when a reset-form action is executed (see 12.7.5.3, “Reset-Form Action”). The format of this value is the same as that of value.
   *
   * @name AcroFormField#defaultValue
   * @default null
   * @type {any}
   */
  Object.defineProperty(this, "defaultValue", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (this instanceof AcroFormButton === true) {
        return pdfUnescape(_DV.substr(1, _DV.length - 1));
      } else {
        return _DV;
      }
    },
    set: function set(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === true) {
        _DV = "/" + value;
      } else {
        _DV = value;
      }
    }
  });
  var _V = null;
  Object.defineProperty(this, "_V", {
    enumerable: false,
    configurable: false,
    get: function get() {
      if (!_V) {
        return undefined;
      }
      return _V;
    },
    set: function set(value) {
      this.V = value;
    }
  });
  Object.defineProperty(this, "V", {
    enumerable: false,
    configurable: false,
    get: function get() {
      if (!_V) {
        return undefined;
      }
      if (this instanceof AcroFormButton === false) {
        return toPdfString(_V, this.objId, this.scope);
      }
      return _V;
    },
    set: function set(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === false) {
        if (value.substr(0, 1) === "(") {
          _V = pdfUnescape(value.substr(1, value.length - 2));
        } else {
          _V = pdfUnescape(value);
        }
      } else {
        _V = value;
      }
    }
  });

  /**
   * (Optional; inheritable) The field’s value, whose format varies depending on the field type. See the descriptions of individual field types for further information.
   *
   * @name AcroFormField#value
   * @default null
   * @type {any}
   */
  Object.defineProperty(this, "value", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (this instanceof AcroFormButton === true) {
        return pdfUnescape(_V.substr(1, _V.length - 1));
      } else {
        return _V;
      }
    },
    set: function set(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === true) {
        _V = "/" + value;
      } else {
        _V = value;
      }
    }
  });

  /**
   * Check if field has annotations
   *
   * @name AcroFormField#hasAnnotation
   * @readonly
   * @type {boolean}
   */
  Object.defineProperty(this, "hasAnnotation", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return this.Rect;
    }
  });
  Object.defineProperty(this, "Type", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return this.hasAnnotation ? "/Annot" : null;
    }
  });
  Object.defineProperty(this, "Subtype", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return this.hasAnnotation ? "/Widget" : null;
    }
  });
  var _hasAppearanceStream = false;
  /**
   * true if field has an appearanceStream
   *
   * @name AcroFormField#hasAppearanceStream
   * @readonly
   * @type {boolean}
   */
  Object.defineProperty(this, "hasAppearanceStream", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _hasAppearanceStream;
    },
    set: function set(value) {
      value = Boolean(value);
      _hasAppearanceStream = value;
    }
  });

  /**
   * The page on which the AcroFormField is placed
   *
   * @name AcroFormField#page
   * @type {number}
   */
  var _page;
  Object.defineProperty(this, "page", {
    enumerable: true,
    configurable: true,
    get: function get() {
      if (!_page) {
        return undefined;
      }
      return _page;
    },
    set: function set(value) {
      _page = value;
    }
  });

  /**
   * If set, the user may not change the value of the field. Any associated widget annotations will not interact with the user; that is, they will not respond to mouse clicks or change their appearance in response to mouse motions. This flag is useful for fields whose values are computed or imported from a database.
   *
   * @name AcroFormField#readOnly
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "readOnly", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 1));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 1);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 1);
      }
    }
  });

  /**
   * If set, the field shall have a value at the time it is exported by a submitform action (see 12.7.5.2, “Submit-Form Action”).
   *
   * @name AcroFormField#required
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "required", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 2));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 2);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 2);
      }
    }
  });

  /**
   * If set, the field shall not be exported by a submit-form action (see 12.7.5.2, “Submit-Form Action”)
   *
   * @name AcroFormField#noExport
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "noExport", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 3));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 3);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 3);
      }
    }
  });
  var _Q = null;
  Object.defineProperty(this, "Q", {
    enumerable: true,
    configurable: false,
    get: function get() {
      if (_Q === null) {
        return undefined;
      }
      return _Q;
    },
    set: function set(value) {
      if ([0, 1, 2].indexOf(value) !== -1) {
        _Q = value;
      } else {
        throw new Error('Invalid value "' + value + '" for attribute Q supplied.');
      }
    }
  });

  /**
   * (Optional; inheritable) A code specifying the form of quadding (justification) that shall be used in displaying the text:
   * 'left', 'center', 'right'
   *
   * @name AcroFormField#textAlign
   * @default 'left'
   * @type {string}
   */
  Object.defineProperty(this, "textAlign", {
    get: function get() {
      var result;
      switch (_Q) {
        case 0:
        default:
          result = "left";
          break;
        case 1:
          result = "center";
          break;
        case 2:
          result = "right";
          break;
      }
      return result;
    },
    configurable: true,
    enumerable: true,
    set: function set(value) {
      switch (value) {
        case "right":
        case 2:
          _Q = 2;
          break;
        case "center":
        case 1:
          _Q = 1;
          break;
        case "left":
        case 0:
        default:
          _Q = 0;
      }
    }
  });
};

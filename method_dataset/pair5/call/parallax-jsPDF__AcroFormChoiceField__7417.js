var AcroFormChoiceField = function AcroFormChoiceField() {
  AcroFormField.call(this);
  // Field Type = Choice Field
  this.FT = "/Ch";
  // options
  this.V = "()";
  this.fontName = "zapfdingbats";
  // Top Index
  var _TI = 0;
  Object.defineProperty(this, "TI", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return _TI;
    },
    set: function set(value) {
      _TI = value;
    }
  });

  /**
   * (Optional) For scrollable list boxes, the top index (the index in the Opt array of the first option visible in the list). Default value: 0.
   *
   * @name AcroFormChoiceField#topIndex
   * @default 0
   * @type {number}
   */
  Object.defineProperty(this, "topIndex", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _TI;
    },
    set: function set(value) {
      _TI = value;
    }
  });
  var _Opt = [];
  Object.defineProperty(this, "Opt", {
    enumerable: true,
    configurable: false,
    get: function get() {
      return arrayToPdfArray(_Opt, this.objId, this.scope);
    },
    set: function set(value) {
      _Opt = pdfArrayToStringArray(value);
    }
  });

  /**
   * @memberof AcroFormChoiceField
   * @name getOptions
   * @function
   * @instance
   * @returns {array} array of Options
   */
  this.getOptions = function () {
    return _Opt;
  };

  /**
   * @memberof AcroFormChoiceField
   * @name setOptions
   * @function
   * @instance
   * @param {array} value
   */
  this.setOptions = function (value) {
    _Opt = value;
    if (this.sort) {
      _Opt.sort();
    }
  };

  /**
   * @memberof AcroFormChoiceField
   * @name addOption
   * @function
   * @instance
   * @param {string} value
   */
  this.addOption = function (value) {
    value = value || "";
    value = value.toString();
    _Opt.push(value);
    if (this.sort) {
      _Opt.sort();
    }
  };

  /**
   * @memberof AcroFormChoiceField
   * @name removeOption
   * @function
   * @instance
   * @param {string} value
   * @param {boolean} allEntries (default: false)
   */
  this.removeOption = function (value, allEntries) {
    allEntries = allEntries || false;
    value = value || "";
    value = value.toString();
    while (_Opt.indexOf(value) !== -1) {
      _Opt.splice(_Opt.indexOf(value), 1);
      if (allEntries === false) {
        break;
      }
    }
  };

  /**
   * If set, the field is a combo box; if clear, the field is a list box.
   *
   * @name AcroFormChoiceField#combo
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "combo", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 18));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 18);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 18);
      }
    }
  });

  /**
   * If set, the combo box shall include an editable text box as well as a drop-down list; if clear, it shall include only a drop-down list. This flag shall be used only if the Combo flag is set.
   *
   * @name AcroFormChoiceField#edit
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "edit", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 19));
    },
    set: function set(value) {
      //PDF 32000-1:2008, page 444
      if (this.combo === true) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 19);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 19);
        }
      }
    }
  });

  /**
   * If set, the field’s option items shall be sorted alphabetically. This flag is intended for use by writers, not by readers. Conforming readers shall display the options in the order in which they occur in the Opt array (see Table 231).
   *
   * @name AcroFormChoiceField#sort
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "sort", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 20));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 20);
        _Opt.sort();
      } else {
        this.Ff = clearBitForPdf(this.Ff, 20);
      }
    }
  });

  /**
   * (PDF 1.4) If set, more than one of the field’s option items may be selected simultaneously; if clear, at most one item shall be selected
   *
   * @name AcroFormChoiceField#multiSelect
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "multiSelect", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 22));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 22);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 22);
      }
    }
  });

  /**
   * (PDF 1.4) If set, text entered in the field shall not be spellchecked. This flag shall not be used unless the Combo and Edit flags are both set.
   *
   * @name AcroFormChoiceField#doNotSpellCheck
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "doNotSpellCheck", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 23));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 23);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 23);
      }
    }
  });

  /**
   * (PDF 1.5) If set, the new value shall be committed as soon as a selection is made (commonly with the pointing device). In this case, supplying a value for a field involves three actions: selecting the field for fill-in, selecting a choice for the fill-in value, and leaving that field, which finalizes or “commits” the data choice and triggers any actions associated with the entry or changing of this data. If this flag is on, then processing does not wait for leaving the field action to occur, but immediately proceeds to the third step.
   * This option enables applications to perform an action once a selection is made, without requiring the user to exit the field. If clear, the new value is not committed until the user exits the field.
   *
   * @name AcroFormChoiceField#commitOnSelChange
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "commitOnSelChange", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return Boolean(getBitForPdf(this.Ff, 27));
    },
    set: function set(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 27);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 27);
      }
    }
  });
  this.hasAppearanceStream = false;
};

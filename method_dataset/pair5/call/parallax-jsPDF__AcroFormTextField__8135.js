  var AcroFormTextField = function AcroFormTextField() {
    AcroFormField.call(this);
    this.FT = "/Tx";

    /**
     * If set, the field may contain multiple lines of text; if clear, the field’s text shall be restricted to a single line.
     *
     * @name AcroFormTextField#multiline
     * @type {boolean}
     */
    Object.defineProperty(this, "multiline", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return Boolean(getBitForPdf(this.Ff, 13));
      },
      set: function set(value) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 13);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 13);
        }
      }
    });

    /**
     * (PDF 1.4) If set, the text entered in the field represents the pathname of a file whose contents shall be submitted as the value of the field.
     *
     * @name AcroFormTextField#fileSelect
     * @type {boolean}
     */
    Object.defineProperty(this, "fileSelect", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return Boolean(getBitForPdf(this.Ff, 21));
      },
      set: function set(value) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 21);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 21);
        }
      }
    });

    /**
     * (PDF 1.4) If set, text entered in the field shall not be spell-checked.
     *
     * @name AcroFormTextField#doNotSpellCheck
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
     * (PDF 1.4) If set, the field shall not scroll (horizontally for single-line fields, vertically for multiple-line fields) to accommodate more text than fits within its annotation rectangle. Once the field is full, no further text shall be accepted for interactive form filling; for noninteractive form filling, the filler should take care not to add more character than will visibly fit in the defined area.
     *
     * @name AcroFormTextField#doNotScroll
     * @type {boolean}
     */
    Object.defineProperty(this, "doNotScroll", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return Boolean(getBitForPdf(this.Ff, 24));
      },
      set: function set(value) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 24);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 24);
        }
      }
    });

    /**
     * (PDF 1.5) May be set only if the MaxLen entry is present in the text field dictionary (see Table 229) and if the Multiline, Password, and FileSelect flags are clear. If set, the field shall be automatically divided into as many equally spaced positions, or combs, as the value of MaxLen, and the text is laid out into those combs.
     *
     * @name AcroFormTextField#comb
     * @type {boolean}
     */
    Object.defineProperty(this, "comb", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return Boolean(getBitForPdf(this.Ff, 25));
      },
      set: function set(value) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 25);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 25);
        }
      }
    });

    /**
     * (PDF 1.5) If set, the value of this field shall be a rich text string (see 12.7.3.4, “Rich Text Strings”). If the field has a value, the RV entry of the field dictionary (Table 222) shall specify the rich text string.
     *
     * @name AcroFormTextField#richText
     * @type {boolean}
     */
    Object.defineProperty(this, "richText", {
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
    var _MaxLen = null;
    Object.defineProperty(this, "MaxLen", {
      enumerable: true,
      configurable: false,
      get: function get() {
        return _MaxLen;
      },
      set: function set(value) {
        _MaxLen = value;
      }
    });

    /**
     * (Optional; inheritable) The maximum length of the field’s text, in characters.
     *
     * @name AcroFormTextField#maxLength
     * @type {number}
     */
    Object.defineProperty(this, "maxLength", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return _MaxLen;
      },
      set: function set(value) {
        if (Number.isInteger(value)) {
          _MaxLen = value;
        }
      }
    });
    Object.defineProperty(this, "hasAppearanceStream", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return this.V || this.DV;
      }
    });
  };

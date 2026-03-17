  var AcroFormPasswordField = function AcroFormPasswordField() {
    AcroFormTextField.call(this);

    /**
     * If set, the field is intended for entering a secure password that should not be echoed visibly to the screen. Characters typed from the keyboard shall instead be echoed in some unreadable form, such as asterisks or bullet characters.
     * NOTE To protect password confidentiality, readers should never store the value of the text field in the PDF file if this flag is set.
     *
     * @name AcroFormTextField#password
     * @type {boolean}
     */
    Object.defineProperty(this, "password", {
      enumerable: true,
      configurable: true,
      get: function get() {
        return Boolean(getBitForPdf(this.Ff, 14));
      },
      set: function set(value) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 14);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 14);
        }
      }
    });
    this.password = true;
  };

class __C__ {
  validateUserInput(propMeta, value) {

    this.throwIfNotObject(propMeta, propMeta.label);

    // Check if there is extra type in prop meta. Like string can be also date type
    const type = ("extendedType" in propMeta)
      ? propMeta.extendedType
      : propMeta.type;

    // Decide which method to call based on the input we want to check.

    const validators = {
      "string": this.throwIfBlankOrNotString,
      "integer": this.throwIfNotWholeNumber,
      "string[]": this.throwIfNotArrayOfStrings,
      "object": this.throwIfNotObjectOrArray,
      "array": this.throwIfNotArray,
      "YYYY-MM-DD": this.throwIfNotYMDDashDate,
      "url": this.checkIfUrlValid,
    };

    const validator = validators[type];

    if (!validator) {
      this.throwCustomError(`No validator found for type "${type}"`, propMeta.label);
    };

    // Calls the correct function and passes label
    // to show as a reason if it throws an error or issues a warning.
    return validator.call(this, value, propMeta.label);

  },

}

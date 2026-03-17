function __method_wrapper__() {
AcroFormRadioButton.prototype.setAppearance = function(appearance) {
  if (!("createAppearanceStream" in appearance && "getCA" in appearance)) {
    throw new Error(
      "Couldn't assign Appearance to RadioButton. Appearance was Invalid!"
    );
  }
  for (var objId in this.Kids) {
    if (this.Kids.hasOwnProperty(objId)) {
      var child = this.Kids[objId];
      child.appearanceStreamContent = appearance.createAppearanceStream(
        child.optionName
      );
      child.caption = appearance.getCA();
    }
  }
};

}

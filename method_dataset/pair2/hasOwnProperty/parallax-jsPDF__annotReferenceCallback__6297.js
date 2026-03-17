var annotReferenceCallback = function annotReferenceCallback(scope) {
  //set objId to undefined and force it to get a new objId on buildDocument
  scope.internal.acroformPlugin.acroFormDictionaryRoot.objId = undefined;
  var fields = scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
  for (var i in fields) {
    if (fields.hasOwnProperty(i)) {
      var formObject = fields[i];
      //set objId to undefined and force it to get a new objId on buildDocument
      formObject.objId = undefined;
      // add Annot Reference!
      if (formObject.hasAnnotation) {
        // If theres an Annotation Widget in the Form Object, put the
        // Reference in the /Annot array
        createAnnotationReference(formObject, scope);
      }
    }
  }
};

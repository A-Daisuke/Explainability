var createXFormObjectCallback = function(fieldArray, scope) {
  for (var i in fieldArray) {
    if (fieldArray.hasOwnProperty(i)) {
      var key = i;
      var fieldObject = fieldArray[i];
      // Start Writing the Object
      scope.internal.newObjectDeferredBegin(fieldObject.objId, true);

      if (
        typeof fieldObject === "object" &&
        typeof fieldObject.putStream === "function"
      ) {
        fieldObject.putStream();
      }
      delete fieldArray[key];
    }
  }
};

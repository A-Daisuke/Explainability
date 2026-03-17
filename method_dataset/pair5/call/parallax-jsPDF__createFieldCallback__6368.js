var createFieldCallback = function createFieldCallback(fieldArray, scope) {
  var standardFields = !fieldArray;
  if (!fieldArray) {
    // in case there is no fieldArray specified, we want to print out
    // the Fields of the AcroForm
    // Print out Root
    scope.internal.newObjectDeferredBegin(scope.internal.acroformPlugin.acroFormDictionaryRoot.objId, true);
    scope.internal.acroformPlugin.acroFormDictionaryRoot.putStream();
  }
  fieldArray = fieldArray || scope.internal.acroformPlugin.acroFormDictionaryRoot.Kids;
  for (var i in fieldArray) {
    if (fieldArray.hasOwnProperty(i)) {
      var fieldObject = fieldArray[i];
      var keyValueList = [];
      var oldRect = fieldObject.Rect;
      if (fieldObject.Rect) {
        fieldObject.Rect = calculateCoordinates(fieldObject.Rect, scope);
      }

      // Start Writing the Object
      scope.internal.newObjectDeferredBegin(fieldObject.objId, true);
      fieldObject.DA = AcroFormAppearance.createDefaultAppearanceStream(fieldObject);
      if (_typeof(fieldObject) === "object" && typeof fieldObject.getKeyValueListForStream === "function") {
        keyValueList = fieldObject.getKeyValueListForStream();
      }
      fieldObject.Rect = oldRect;
      if (fieldObject.hasAppearanceStream && !fieldObject.appearanceStreamContent) {
        // Calculate Appearance
        var appearance = calculateAppearanceStream(fieldObject);
        keyValueList.push({
          key: "AP",
          value: "<</N " + appearance + ">>"
        });
        scope.internal.acroformPlugin.xForms.push(appearance);
      }

      // Assume AppearanceStreamContent is a Array with N,R,D (at least
      // one of them!)
      if (fieldObject.appearanceStreamContent) {
        var appearanceStreamString = "";
        // Iterate over N,R and D
        for (var k in fieldObject.appearanceStreamContent) {
          if (fieldObject.appearanceStreamContent.hasOwnProperty(k)) {
            var value = fieldObject.appearanceStreamContent[k];
            appearanceStreamString += "/" + k + " ";
            appearanceStreamString += "<<";
            if (Object.keys(value).length >= 1 || Array.isArray(value)) {
              // appearanceStream is an Array or Object!
              for (var i in value) {
                if (value.hasOwnProperty(i)) {
                  var obj = value[i];
                  if (typeof obj === "function") {
                    // if Function is referenced, call it in order
                    // to get the FormXObject
                    obj = obj.call(scope, fieldObject);
                  }
                  appearanceStreamString += "/" + i + " " + obj + " ";

                  // In case the XForm is already used, e.g. OffState
                  // of CheckBoxes, don't add it
                  if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0)) scope.internal.acroformPlugin.xForms.push(obj);
                }
              }
            } else {
              obj = value;
              if (typeof obj === "function") {
                // if Function is referenced, call it in order to
                // get the FormXObject
                obj = obj.call(scope, fieldObject);
              }
              appearanceStreamString += "/" + i + " " + obj;
              if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0)) scope.internal.acroformPlugin.xForms.push(obj);
            }
            appearanceStreamString += ">>";
          }
        }

        // appearance stream is a normal Object..
        keyValueList.push({
          key: "AP",
          value: "<<\n" + appearanceStreamString + ">>"
        });
      }
      scope.internal.putStream({
        additionalKeyValues: keyValueList,
        objectId: fieldObject.objId
      });
      scope.internal.out("endobj");
    }
  }
  if (standardFields) {
    createXFormObjectCallback(scope.internal.acroformPlugin.xForms, scope);
  }
};

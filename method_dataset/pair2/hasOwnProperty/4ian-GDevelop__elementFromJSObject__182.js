  const elementFromJSObject = function (object, element) {
    if (typeof object === 'number') {
      element.setDoubleValue(object);
    } else if (typeof object === 'string') {
      element.setStringValue(object);
    } else if (typeof object === 'boolean') {
      element.setBoolValue(object);
    } else if (Array.isArray(object)) {
      element.considerAsArray();
      for (var i = 0; i < object.length; ++i) {
        var item = element.addChild('');
        elementFromJSObject(object[i], item);
      }
    } else if (typeof object === 'object') {
      for (var childName in object) {
        if (object.hasOwnProperty(childName)) {
          var child = element.addChild(childName);
          elementFromJSObject(object[childName], child);
        }
      }
    }
  };

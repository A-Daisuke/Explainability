  var putTilingPatternDict = function(objectOid) {
    if (Object.keys(patterns).length > 0) {
      out("/Pattern <<");
      for (var patternKey in patterns) {
        if (
          patterns.hasOwnProperty(patternKey) &&
          patterns[patternKey] instanceof API.TilingPattern &&
          patterns[patternKey].objectNumber >= 0 &&
          patterns[patternKey].objectNumber < objectOid // prevent cyclic dependencies
        ) {
          out(
            "/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R"
          );
        }
      }
      events.publish("putTilingPatternDict");
      out(">>");
    }
  };

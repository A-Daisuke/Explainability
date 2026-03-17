  var putShadingPatternDict = function() {
    if (Object.keys(patterns).length > 0) {
      out("/Shading <<");
      for (var patternKey in patterns) {
        if (
          patterns.hasOwnProperty(patternKey) &&
          patterns[patternKey] instanceof ShadingPattern &&
          patterns[patternKey].objectNumber >= 0
        ) {
          out(
            "/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R"
          );
        }
      }

      events.publish("putShadingPatternDict");
      out(">>");
    }
  };

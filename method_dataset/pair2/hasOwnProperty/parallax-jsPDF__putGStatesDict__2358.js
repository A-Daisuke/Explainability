  var putGStatesDict = function() {
    if (Object.keys(gStates).length > 0) {
      var gStateKey;
      out("/ExtGState <<");
      for (gStateKey in gStates) {
        if (
          gStates.hasOwnProperty(gStateKey) &&
          gStates[gStateKey].objectNumber >= 0
        ) {
          out("/" + gStateKey + " " + gStates[gStateKey].objectNumber + " 0 R");
        }
      }

      events.publish("putGStateDict");
      out(">>");
    }
  };

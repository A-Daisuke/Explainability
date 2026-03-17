  var addGState = function addGState(key, gState) {
    // only add it if it is not already present (the keys provided by the user must be unique!)
    if (key && gStatesMap[key]) return;
    var duplicate = false;
    for (var s in gStates) {
      if (gStates.hasOwnProperty(s)) {
        if (gStates[s].equals(gState)) {
          duplicate = true;
          break;
        }
      }
    }
    if (duplicate) {
      gState = gStates[s];
    } else {
      var gStateKey = "GS" + (Object.keys(gStates).length + 1).toString(10);
      gStates[gStateKey] = gState;
      gState.id = gStateKey;
    }

    // several user keys may point to the same GState object
    key && (gStatesMap[key] = gState.id);
    events.publish("addGState", gState);
    return gState;
  };

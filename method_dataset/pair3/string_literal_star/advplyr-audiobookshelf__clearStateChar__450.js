    const clearStateChar = () => {
      if (stateChar) {
        // we had some state-tracking character
        // that wasn't consumed by this pass.
        switch (stateChar) {
          case '*':
            re += star
            hasMagic = true
            break
          case '?':
            re += qmark
            hasMagic = true
            break
          default:
            re += '\\' + stateChar
            break
        }
        this.debug('clearStateChar %j %j', stateChar, re)
        stateChar = false
      }
    }

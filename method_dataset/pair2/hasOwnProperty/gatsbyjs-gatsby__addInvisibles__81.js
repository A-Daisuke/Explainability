  function addInvisibles(grammar) {
    if (!grammar || grammar[`tab`]) {
      return
    }

    // assign invisibles here to "mark" the grammar in case of self references
    for (const name in invisibles) {
      if (invisibles.hasOwnProperty(name)) {
        grammar[name] = invisibles[name]
      }
    }

    /* eslint-disable no-redeclare */
    for (const name in grammar) {
      /* eslint-enable no-redeclare */
      if (grammar.hasOwnProperty(name) && !invisibles[name]) {
        if (name === `rest`) {
          addInvisibles(grammar[`rest`])
        } else {
          handleToken(grammar, name)
        }
      }
    }
  }

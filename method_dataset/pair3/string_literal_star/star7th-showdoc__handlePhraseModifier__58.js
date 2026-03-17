  function handlePhraseModifier(stream, state, ch) {
    if (ch === "_") {
      if (stream.eat("_"))
        return togglePhraseModifier(stream, state, "italic", /__/, 2);
      else
        return togglePhraseModifier(stream, state, "em", /_/, 1);
    }

    if (ch === "*") {
      if (stream.eat("*")) {
        return togglePhraseModifier(stream, state, "bold", /\*\*/, 2);
      }
      return togglePhraseModifier(stream, state, "strong", /\*/, 1);
    }

    if (ch === "[") {
      if (stream.match(/\d+\]/)) state.footCite = true;
      return tokenStyles(state);
    }

    if (ch === "(") {
      var spec = stream.match(/^(r|tm|c)\)/);
      if (spec)
        return tokenStylesWith(state, TOKEN_STYLES.specialChar);
    }

    if (ch === "<" && stream.match(/(\w+)[^>]+>[^<]+<\/\1>/))
      return tokenStylesWith(state, TOKEN_STYLES.html);

    if (ch === "?" && stream.eat("?"))
      return togglePhraseModifier(stream, state, "cite", /\?\?/, 2);

    if (ch === "=" && stream.eat("="))
      return togglePhraseModifier(stream, state, "notextile", /==/, 2);

    if (ch === "-" && !stream.eat("-"))
      return togglePhraseModifier(stream, state, "deletion", /-/, 1);

    if (ch === "+")
      return togglePhraseModifier(stream, state, "addition", /\+/, 1);

    if (ch === "~")
      return togglePhraseModifier(stream, state, "sub", /~/, 1);

    if (ch === "^")
      return togglePhraseModifier(stream, state, "sup", /\^/, 1);

    if (ch === "%")
      return togglePhraseModifier(stream, state, "span", /%/, 1);

    if (ch === "@")
      return togglePhraseModifier(stream, state, "code", /@/, 1);

    if (ch === "!") {
      var type = togglePhraseModifier(stream, state, "image", /(?:\([^\)]+\))?!/, 1);
      stream.match(/^:\S+/); // optional Url portion
      return type;
    }
    return tokenStyles(state);
  }

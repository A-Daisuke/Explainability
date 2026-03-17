const makeOrd = function<NODETYPE: "spacing" | "mathord" | "textord">(
    group: ParseNode<NODETYPE>,
    options: Options,
    type: "mathord" | "textord",
): HtmlDocumentFragment | SymbolNode {
    const mode = group.mode;
    const text = group.text;

    const classes = ["mord"];

    // Math mode or Old font (i.e. \rm)
    const isFont = mode === "math" || (mode === "text" && options.font);
    const fontOrFamily = isFont ? options.font : options.fontFamily;
    let wideFontName = "";
    let wideFontClass = "";
    if (text.charCodeAt(0) === 0xD835) {
        [wideFontName, wideFontClass] = wideCharacterFont(text, mode);
    }
    if (wideFontName.length > 0) {
        // surrogate pairs get special treatment
        return makeSymbol(text, wideFontName, mode, options,
            classes.concat(wideFontClass));
    } else if (fontOrFamily) {
        let fontName;
        let fontClasses;
        if (fontOrFamily === "boldsymbol") {
            const fontData = boldsymbol(text, mode, options, classes, type);
            fontName = fontData.fontName;
            fontClasses = [fontData.fontClass];
        } else if (isFont) {
            fontName = fontMap[fontOrFamily].fontName;
            fontClasses = [fontOrFamily];
        } else {
            fontName = retrieveTextFontName(fontOrFamily, options.fontWeight,
                                            options.fontShape);
            fontClasses = [fontOrFamily, options.fontWeight, options.fontShape];
        }

        if (lookupSymbol(text, fontName, mode).metrics) {
            return makeSymbol(text, fontName, mode, options,
                classes.concat(fontClasses));
        } else if (ligatures.hasOwnProperty(text) &&
                   fontName.slice(0, 10) === "Typewriter") {
            // Deconstruct ligatures in monospace fonts (\texttt, \tt).
            const parts = [];
            for (let i = 0; i < text.length; i++) {
                parts.push(makeSymbol(text[i], fontName, mode, options,
                                      classes.concat(fontClasses)));
            }
            return makeFragment(parts);
        }
    }

    // Makes a symbol in the default font for mathords and textords.
    if (type === "mathord") {
        return makeSymbol(text, "Math-Italic", mode, options,
            classes.concat(["mathnormal"]));
    } else if (type === "textord") {
        const font = symbols[mode][text] && symbols[mode][text].font;
        if (font === "ams") {
            const fontName = retrieveTextFontName("amsrm", options.fontWeight,
                  options.fontShape);
            return makeSymbol(
                text, fontName, mode, options,
                classes.concat("amsrm", options.fontWeight, options.fontShape));
        } else if (font === "main" || !font) {
            const fontName = retrieveTextFontName("textrm", options.fontWeight,
                  options.fontShape);
            return makeSymbol(
                text, fontName, mode, options,
                classes.concat(options.fontWeight, options.fontShape));
        } else { // fonts added by plugins
            const fontName = retrieveTextFontName(font, options.fontWeight,
                  options.fontShape);
            // We add font name as a css class
            return makeSymbol(
                text, fontName, mode, options,
                classes.concat(fontName, options.fontWeight, options.fontShape));
        }
    } else {
        throw new Error("unexpected type: " + type + " in makeOrd");
    }
};

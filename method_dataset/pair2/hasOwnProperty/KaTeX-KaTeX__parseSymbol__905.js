function __method_wrapper__() {
    parseSymbol(): ?AnyParseNode {
        const nucleus = this.fetch();
        let text = nucleus.text;

        if (/^\\verb[^a-zA-Z]/.test(text)) {
            this.consume();
            let arg = text.slice(5);
            const star = (arg.charAt(0) === "*");
            if (star) {
                arg = arg.slice(1);
            }
            // Lexer's tokenRegex is constructed to always have matching
            // first/last characters.
            if (arg.length < 2 || arg.charAt(0) !== arg.slice(-1)) {
                throw new ParseError(`\\verb assertion failed --
                    please report what input caused this bug`);
            }
            arg = arg.slice(1, -1);  // remove first and last char
            return {
                type: "verb",
                mode: "text",
                body: arg,
                star,
            };
        }
        // At this point, we should have a symbol, possibly with accents.
        // First expand any accented base symbol according to unicodeSymbols.
        if (unicodeSymbols.hasOwnProperty(text[0]) &&
            !symbols[this.mode][text[0]]) {
            // This behavior is not strict (XeTeX-compatible) in math mode.
            if (this.settings.strict && this.mode === "math") {
                this.settings.reportNonstrict("unicodeTextInMathMode",
                    `Accented Unicode text character "${text[0]}" used in ` +
                    `math mode`, nucleus);
            }
            text = unicodeSymbols[text[0]] + text.slice(1);
        }
        // Strip off any combining characters
        const match = combiningDiacriticalMarksEndRegex.exec(text);
        if (match) {
            text = text.substring(0, match.index);
            if (text === 'i') {
                text = '\u0131';  // dotless i, in math and text mode
            } else if (text === 'j') {
                text = '\u0237';  // dotless j, in math and text mode
            }
        }
        // Recognize base symbol
        let symbol: AnyParseNode;
        if (symbols[this.mode][text]) {
            if (this.settings.strict && this.mode === 'math' &&
                extraLatin.indexOf(text) >= 0) {
                this.settings.reportNonstrict("unicodeTextInMathMode",
                    `Latin-1/Unicode text character "${text[0]}" used in ` +
                    `math mode`, nucleus);
            }
            const group: Group = symbols[this.mode][text].group;
            const loc = SourceLocation.range(nucleus);
            let s: SymbolParseNode;
            if (ATOMS.hasOwnProperty(group)) {
                // $FlowFixMe
                const family: Atom = group;
                s = {
                    type: "atom",
                    mode: this.mode,
                    family,
                    loc,
                    text,
                };
            } else {
                // $FlowFixMe
                s = {
                    type: group,
                    mode: this.mode,
                    loc,
                    text,
                };
            }
            // $FlowFixMe
            symbol = s;
        } else if (text.charCodeAt(0) >= 0x80) { // no symbol for e.g. ^
            if (this.settings.strict) {
                if (!supportedCodepoint(text.charCodeAt(0))) {
                    this.settings.reportNonstrict("unknownSymbol",
                        `Unrecognized Unicode character "${text[0]}"` +
                        ` (${text.charCodeAt(0)})`, nucleus);
                } else if (this.mode === "math") {
                    this.settings.reportNonstrict("unicodeTextInMathMode",
                        `Unicode text character "${text[0]}" used in math mode`,
                        nucleus);
                }
            }
            // All nonmathematical Unicode characters are rendered as if they
            // are in text mode (wrapped in \text) because that's what it
            // takes to render them in LaTeX.  Setting `mode: this.mode` is
            // another natural choice (the user requested math mode), but
            // this makes it more difficult for getCharacterMetrics() to
            // distinguish Unicode characters without metrics and those for
            // which we want to simulate the letter M.
            symbol = {
                type: "textord",
                mode: "text",
                loc: SourceLocation.range(nucleus),
                text,
            };
        } else {
            return null;  // EOF, ^, _, {, }, etc.
        }
        this.consume();
        // Transform combining characters into accents
        if (match) {
            for (let i = 0; i < match[0].length; i++) {
                const accent: string = match[0][i];
                if (!unicodeAccents[accent]) {
                    throw new ParseError(`Unknown accent ' ${accent}'`, nucleus);
                }
                const command = unicodeAccents[accent][this.mode] ||
                    unicodeAccents[accent].text;
                if (!command) {
                    throw new ParseError(
                        `Accent ${accent} unsupported in ${this.mode} mode`,
                        nucleus);
                }
                symbol = {
                    type: "accent",
                    mode: this.mode,
                    loc: SourceLocation.range(nucleus),
                    label: command,
                    isStretchy: false,
                    isShifty: true,
                    // $FlowFixMe
                    base: symbol,
                };
            }
        }
        // $FlowFixMe
        return symbol;
    }

}

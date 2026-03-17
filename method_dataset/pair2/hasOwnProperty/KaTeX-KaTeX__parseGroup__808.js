function __method_wrapper__() {
    parseGroup(
        name: string, // For error reporting.
        breakOnTokenText?: BreakToken,
    ): ?AnyParseNode {
        const firstToken = this.fetch();
        const text = firstToken.text;

        let result;
        // Try to parse an open brace or \begingroup
        if (text === "{" || text === "\\begingroup") {
            this.consume();
            const groupEnd = text === "{" ? "}" : "\\endgroup";

            this.gullet.beginGroup();
            // If we get a brace, parse an expression
            const expression = this.parseExpression(false, groupEnd);
            const lastToken = this.fetch();
            this.expect(groupEnd); // Check that we got a matching closing brace
            this.gullet.endGroup();
            result = {
                type: "ordgroup",
                mode: this.mode,
                loc: SourceLocation.range(firstToken, lastToken),
                body: expression,
                // A group formed by \begingroup...\endgroup is a semi-simple group
                // which doesn't affect spacing in math mode, i.e., is transparent.
                // https://tex.stackexchange.com/questions/1930/when-should-one-
                // use-begingroup-instead-of-bgroup
                semisimple: text === "\\begingroup" || undefined,
            };
        } else {
            // If there exists a function with this name, parse the function.
            // Otherwise, just return a nucleus
            result = this.parseFunction(breakOnTokenText, name) ||
                this.parseSymbol();
            if (result == null && text[0] === "\\" &&
                    !implicitCommands.hasOwnProperty(text)) {
                if (this.settings.throwOnError) {
                    throw new ParseError(
                        "Undefined control sequence: " + text, firstToken);
                }
                result = this.formatUnsupportedCmd(text);
                this.consume();
            }
        }
        return result;
    }

}

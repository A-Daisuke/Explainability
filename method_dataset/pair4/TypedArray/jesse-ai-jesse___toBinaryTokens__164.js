function __method_wrapper__() {
    _toBinaryTokens(languageIdCodec, tokens) {
        const languageId = languageIdCodec.encodeLanguageId(this._languageId);
        const tokenTheme = this._standaloneThemeService.getColorTheme().tokenTheme;
        const result = [];
        let resultLen = 0;
        let previousStartIndex = 0;
        for (let i = 0, len = tokens.length; i < len; i++) {
            const t = tokens[i];
            const metadata = tokenTheme.match(languageId, t.scopes) | 1024 /* MetadataConsts.BALANCED_BRACKETS_MASK */;
            if (resultLen > 0 && result[resultLen - 1] === metadata) {
                // same metadata
                continue;
            }
            let startIndex = t.startIndex;
            // Prevent issues stemming from a buggy external tokenizer.
            if (i === 0) {
                // Force first token to start at first index!
                startIndex = 0;
            }
            else if (startIndex < previousStartIndex) {
                // Force tokens to be after one another!
                startIndex = previousStartIndex;
            }
            result[resultLen++] = startIndex;
            result[resultLen++] = metadata;
            previousStartIndex = startIndex;
        }
        const actualResult = new Uint32Array(resultLen);
        for (let i = 0; i < resultLen; i++) {
            actualResult[i] = result[i];
        }
        return actualResult;
    }

}

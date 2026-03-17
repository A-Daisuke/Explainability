class __C__ {
    getProcessedLine(lineNumber, newIndentation) {
        var _a, _b;
        const replaceIndentation = (line, newIndentation) => {
            const currentIndentation = strings.getLeadingWhitespace(line);
            const adjustedLine = newIndentation + line.substring(currentIndentation.length);
            return adjustedLine;
        };
        (_b = (_a = this.model.tokenization).forceTokenization) === null || _b === void 0 ? void 0 : _b.call(_a, lineNumber);
        const tokens = this.model.tokenization.getLineTokens(lineNumber);
        let processedLine = this.getProcessedTokens(tokens).getLineContent();
        if (newIndentation !== undefined) {
            processedLine = replaceIndentation(processedLine, newIndentation);
        }
        return processedLine;
    }

}

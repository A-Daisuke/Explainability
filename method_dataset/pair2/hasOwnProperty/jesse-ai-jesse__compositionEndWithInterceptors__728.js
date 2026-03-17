function __method_wrapper__() {
    static compositionEndWithInterceptors(prevEditOperationType, config, model, compositions, selections, autoClosedCharacters) {
        if (!compositions) {
            // could not deduce what the composition did
            return null;
        }
        let insertedText = null;
        for (const composition of compositions) {
            if (insertedText === null) {
                insertedText = composition.insertedText;
            }
            else if (insertedText !== composition.insertedText) {
                // not all selections agree on what was typed
                return null;
            }
        }
        if (!insertedText || insertedText.length !== 1) {
            // we're only interested in the case where a single character was inserted
            return null;
        }
        const ch = insertedText;
        let hasDeletion = false;
        for (const composition of compositions) {
            if (composition.deletedText.length !== 0) {
                hasDeletion = true;
                break;
            }
        }
        if (hasDeletion) {
            // Check if this could have been a surround selection
            if (!TypeOperations._shouldSurroundChar(config, ch) || !config.surroundingPairs.hasOwnProperty(ch)) {
                return null;
            }
            const isTypingAQuoteCharacter = isQuote(ch);
            for (const composition of compositions) {
                if (composition.deletedSelectionStart !== 0 || composition.deletedSelectionEnd !== composition.deletedText.length) {
                    // more text was deleted than was selected, so this could not have been a surround selection
                    return null;
                }
                if (/^[ \t]+$/.test(composition.deletedText)) {
                    // deleted text was only whitespace
                    return null;
                }
                if (isTypingAQuoteCharacter && isQuote(composition.deletedText)) {
                    // deleted text was a quote
                    return null;
                }
            }
            const positions = [];
            for (const selection of selections) {
                if (!selection.isEmpty()) {
                    return null;
                }
                positions.push(selection.getPosition());
            }
            if (positions.length !== compositions.length) {
                return null;
            }
            const commands = [];
            for (let i = 0, len = positions.length; i < len; i++) {
                commands.push(new CompositionSurroundSelectionCommand(positions[i], compositions[i].deletedText, config.surroundingPairs[ch]));
            }
            return new EditOperationResult(4 /* EditOperationType.TypingOther */, commands, {
                shouldPushStackElementBefore: true,
                shouldPushStackElementAfter: false
            });
        }
        if (this._isAutoClosingOvertype(config, model, selections, autoClosedCharacters, ch)) {
            // Unfortunately, the close character is at this point "doubled", so we need to delete it...
            const commands = selections.map(s => new ReplaceCommand(new Range(s.positionLineNumber, s.positionColumn, s.positionLineNumber, s.positionColumn + 1), '', false));
            return new EditOperationResult(4 /* EditOperationType.TypingOther */, commands, {
                shouldPushStackElementBefore: true,
                shouldPushStackElementAfter: false
            });
        }
        const autoClosingPairClose = this._getAutoClosingPairClose(config, model, selections, ch, true);
        if (autoClosingPairClose !== null) {
            return this._runAutoClosingOpenCharType(prevEditOperationType, config, model, selections, ch, true, autoClosingPairClose);
        }
        return null;
    }

}

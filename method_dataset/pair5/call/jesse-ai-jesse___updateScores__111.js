class __C__ {
    _updateScores(model) {
        var _a, _b;
        const notebookInfo = (_a = this._notebookInfoResolver) === null || _a === void 0 ? void 0 : _a.call(this, model.uri);
        // use the uri (scheme, pattern) of the notebook info iff we have one
        // otherwise it's the model's/document's uri
        const candidate = notebookInfo
            ? new MatchCandidate(model.uri, model.getLanguageId(), notebookInfo.uri, notebookInfo.type)
            : new MatchCandidate(model.uri, model.getLanguageId(), undefined, undefined);
        if ((_b = this._lastCandidate) === null || _b === void 0 ? void 0 : _b.equals(candidate)) {
            // nothing has changed
            return;
        }
        this._lastCandidate = candidate;
        for (const entry of this._entries) {
            entry._score = score(entry.selector, candidate.uri, candidate.languageId, shouldSynchronizeModel(model), candidate.notebookUri, candidate.notebookType);
            if (isExclusive(entry.selector) && entry._score > 0) {
                // support for one exclusive selector that overwrites
                // any other selector
                for (const entry of this._entries) {
                    entry._score = 0;
                }
                entry._score = 1000;
                break;
            }
        }
        // needs sorting
        this._entries.sort(LanguageFeatureRegistry._compareByScoreAndTime);
    }

}

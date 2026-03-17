    function addRelatedInfo(diagnostic) {
        var _a;
        var relatedInformation = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            relatedInformation[_i - 1] = arguments[_i];
        }
        if (!relatedInformation.length) {
            return diagnostic;
        }
        if (!diagnostic.relatedInformation) {
            diagnostic.relatedInformation = [];
        }
        (_a = diagnostic.relatedInformation).push.apply(_a, relatedInformation);
        return diagnostic;
    }

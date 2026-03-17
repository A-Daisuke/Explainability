    function getSubPatternFromSpec(spec, basePath, usage, _a) {
        var singleAsteriskRegexFragment = _a.singleAsteriskRegexFragment, doubleAsteriskRegexFragment = _a.doubleAsteriskRegexFragment, replaceWildcardCharacter = _a.replaceWildcardCharacter;
        var subpattern = "";
        var hasWrittenComponent = false;
        var components = ts.getNormalizedPathComponents(spec, basePath);
        var lastComponent = ts.last(components);
        if (usage !== "exclude" && lastComponent === "**") {
            return undefined;
        }
        components[0] = ts.removeTrailingDirectorySeparator(components[0]);
        if (isImplicitGlob(lastComponent)) {
            components.push("**", "*");
        }
        var optionalCount = 0;
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var component = components_1[_i];
            if (component === "**") {
                subpattern += doubleAsteriskRegexFragment;
            }
            else {
                if (usage === "directories") {
                    subpattern += "(";
                    optionalCount++;
                }
                if (hasWrittenComponent) {
                    subpattern += ts.directorySeparator;
                }
                if (usage !== "exclude") {
                    var componentPattern = "";
                    if (component.charCodeAt(0) === 42) {
                        componentPattern += "([^./]" + singleAsteriskRegexFragment + ")?";
                        component = component.substr(1);
                    }
                    else if (component.charCodeAt(0) === 63) {
                        componentPattern += "[^./]";
                        component = component.substr(1);
                    }
                    componentPattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter);
                    if (componentPattern !== component) {
                        subpattern += implicitExcludePathRegexPattern;
                    }
                    subpattern += componentPattern;
                }
                else {
                    subpattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter);
                }
            }
            hasWrittenComponent = true;
        }
        while (optionalCount > 0) {
            subpattern += ")?";
            optionalCount--;
        }
        return subpattern;
    }

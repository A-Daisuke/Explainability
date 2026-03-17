    function getSubPatternFromSpec(spec, basePath, usage, _a) {
        var singleAsteriskRegexFragment = _a.singleAsteriskRegexFragment, doubleAsteriskRegexFragment = _a.doubleAsteriskRegexFragment, replaceWildcardCharacter = _a.replaceWildcardCharacter;
        var subpattern = "";
        var hasWrittenComponent = false;
        var components = ts.getNormalizedPathComponents(spec, basePath);
        var lastComponent = ts.last(components);
        if (usage !== "exclude" && lastComponent === "**") {
            return undefined;
        }
        // getNormalizedPathComponents includes the separator for the root component.
        // We need to remove to create our regex correctly.
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
                    // The * and ? wildcards should not match directories or files that start with . if they
                    // appear first in a component. Dotted directories and files can be included explicitly
                    // like so: **/.*/.*
                    if (component.charCodeAt(0) === 42 /* asterisk */) {
                        componentPattern += "([^./]" + singleAsteriskRegexFragment + ")?";
                        component = component.substr(1);
                    }
                    else if (component.charCodeAt(0) === 63 /* question */) {
                        componentPattern += "[^./]";
                        component = component.substr(1);
                    }
                    componentPattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter);
                    // Patterns should not include subfolders like node_modules unless they are
                    // explicitly included as part of the path.
                    //
                    // As an optimization, if the component pattern is the same as the component,
                    // then there definitely were no wildcard characters and we do not need to
                    // add the exclusion pattern.
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

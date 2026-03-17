        var getLanguageNameFromAlias = function (alias) {
            for (var langName in ariaNgLanguages) {
                if (!ariaNgLanguages.hasOwnProperty(langName)) {
                    continue;
                }

                if (langName.toLowerCase() === alias.toLowerCase()) {
                    return langName;
                }

                var language = ariaNgLanguages[langName];
                var aliases = language.aliases;

                if (!angular.isArray(aliases) || aliases.length < 1) {
                    continue;
                }

                for (var i = 0; i < aliases.length; i++) {
                    if (aliases[i].toLowerCase() === alias.toLowerCase()) {
                        return langName;
                    }
                }
            }

            return null;
        };

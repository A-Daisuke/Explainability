function __method_wrapper__() {
            languages: (function () {
                var languages = [];

                for (var langName in ariaNgLanguages) {
                    if (!ariaNgLanguages.hasOwnProperty(langName)) {
                        continue;
                    }

                    var language = ariaNgLanguages[langName];

                    languages.push({
                        type: langName,
                        name: language.name,
                        displayName: language.displayName
                    });
                }

                languages.sort(function (lang1, lang2) {
                    return String.naturalCompare(lang1.type, lang2.type);
                });

                return languages;
            })(),

}

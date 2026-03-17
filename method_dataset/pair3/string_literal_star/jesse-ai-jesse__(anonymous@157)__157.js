function __method_wrapper__() {
        (async () => {
            var _a;
            try {
                const messages = await getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, language, name);
                return messagesLoaded(messages);
            }
            catch (err) {
                // Language is already as generic as it gets, so require default messages
                if (!language.includes('-')) {
                    console.error(err);
                    return req([name + '.nls'], messagesLoaded);
                }
                try {
                    // Since there is a dash, the language configured is a specific sub-language of the same generic language.
                    // Since we were unable to load the specific language, try to load the generic language. Ex. we failed to find a
                    // Swiss German (de-CH), so try to load the generic German (de) messages instead.
                    const genericLanguage = language.split('-')[0];
                    const messages = await getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, genericLanguage, name);
                    // We got some messages, so we configure the configuration to use the generic language for this session.
                    (_a = pluginConfig.availableLanguages) !== null && _a !== void 0 ? _a : (pluginConfig.availableLanguages = {});
                    pluginConfig.availableLanguages['*'] = genericLanguage;
                    return messagesLoaded(messages);
                }
                catch (err) {
                    console.error(err);
                    return req([name + '.nls'], messagesLoaded);
                }
            }
        })();

}

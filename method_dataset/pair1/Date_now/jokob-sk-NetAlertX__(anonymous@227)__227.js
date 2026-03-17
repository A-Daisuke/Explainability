function __method_wrapper__() {
        return new Promise((resolveLang, rejectLang) => {
          // Fetch core strings and translations
          
          $.get(`php/templates/language/${language_code}.json?nocache=${Date.now()}`)
            .done((res) => {
              // Iterate over each key-value pair and store the translations
              Object.entries(res).forEach(([key, value]) => {
                setCache(`pia_lang_${key}_${language_code}`, value);
              });

              // Fetch strings and translations from plugins
              $.get('php/server/query_json.php', { file: 'table_plugins_language_strings.json', nocache: Date.now() })
                .done((pluginRes) => {
                  const data = pluginRes["data"];
                  
                  // Store plugin translations
                  data.forEach((langString) => {
                    setCache(`pia_lang_${langString.String_Key}_${langString.Language_Code}`, langString.String_Value);
                  });

                  // Handle successful completion of language processing
                  handleSuccess(`cacheStrings`, resolveLang);
                })
                .fail((pluginError) => {
                  // Handle failure in plugin strings fetching
                  rejectLang(pluginError);
                });
            })
            .fail((error) => {
              // Handle failure in core strings fetching
              rejectLang(error);
            });
        });

}

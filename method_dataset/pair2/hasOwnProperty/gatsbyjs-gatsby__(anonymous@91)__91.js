function __method_wrapper__() {
      locales.map(locale => {
        let cacheModeOverride = {}

        /* localization requires unique filenames for output files if a different src Icon is defined.
           otherwise one language would override anothers icons in automatic mode.
        */
        if (locale.hasOwnProperty(`icon`) && !locale.hasOwnProperty(`icons`)) {
          // console.debug(`OVERRIDING CACHE BUSTING`, locale)
          cacheModeOverride = { cache_busting_mode: `name` }
        }

        return makeManifest({
          cache,
          reporter,
          pluginOptions: {
            ...manifest,
            ...locale,
            ...cacheModeOverride,
          },
          shouldLocalize: true,
          basePath,
        })
      })

}

function __method_wrapper__() {
  async updateAuthSettings(req, res) {
    if (!req.user.isAdminOrUp) {
      Logger.error(`[MiscController] Non-admin user "${req.user.username}" attempted to update auth settings`)
      return res.sendStatus(403)
    }

    const settingsUpdate = req.body
    if (!isObject(settingsUpdate)) {
      return res.status(400).send('Invalid auth settings update object')
    }

    let hasUpdates = false

    const currentAuthenticationSettings = Database.serverSettings.authenticationSettings
    const originalAuthMethods = [...currentAuthenticationSettings.authActiveAuthMethods]

    // TODO: Better validation of auth settings once auth settings are separated from server settings
    for (const key in currentAuthenticationSettings) {
      if (settingsUpdate[key] === undefined) continue

      if (key === 'authActiveAuthMethods') {
        let updatedAuthMethods = settingsUpdate[key]?.filter?.((authMeth) => Database.serverSettings.supportedAuthMethods.includes(authMeth))
        if (Array.isArray(updatedAuthMethods) && updatedAuthMethods.length) {
          updatedAuthMethods.sort()
          currentAuthenticationSettings[key].sort()
          if (updatedAuthMethods.join() !== currentAuthenticationSettings[key].join()) {
            Logger.debug(`[MiscController] Updating auth settings key "authActiveAuthMethods" from "${currentAuthenticationSettings[key].join()}" to "${updatedAuthMethods.join()}"`)
            Database.serverSettings[key] = updatedAuthMethods
            hasUpdates = true
          }
        } else {
          Logger.warn(`[MiscController] Invalid value for authActiveAuthMethods`)
        }
      } else if (key === 'authOpenIDMobileRedirectURIs') {
        function isValidRedirectURI(uri) {
          if (typeof uri !== 'string') return false
          const pattern = new RegExp('^\\w+://[\\w\\.-]+(/[\\w\\./-]*)*$', 'i')
          return pattern.test(uri)
        }

        const uris = settingsUpdate[key]
        if (!Array.isArray(uris) || (uris.includes('*') && uris.length > 1) || uris.some((uri) => uri !== '*' && !isValidRedirectURI(uri))) {
          Logger.warn(`[MiscController] Invalid value for authOpenIDMobileRedirectURIs`)
          continue
        }

        // Update the URIs
        if (Database.serverSettings[key].some((uri) => !uris.includes(uri)) || uris.some((uri) => !Database.serverSettings[key].includes(uri))) {
          Logger.debug(`[MiscController] Updating auth settings key "${key}" from "${Database.serverSettings[key]}" to "${uris}"`)
          Database.serverSettings[key] = uris
          hasUpdates = true
        }
      } else {
        const updatedValueType = typeof settingsUpdate[key]
        if (['authOpenIDAutoLaunch', 'authOpenIDAutoRegister'].includes(key)) {
          if (updatedValueType !== 'boolean') {
            Logger.warn(`[MiscController] Invalid value for ${key}. Expected boolean`)
            continue
          }
        } else if (settingsUpdate[key] !== null && updatedValueType !== 'string') {
          Logger.warn(`[MiscController] Invalid value for ${key}. Expected string or null`)
          continue
        }
        let updatedValue = settingsUpdate[key]
        if (updatedValue === '' && key != 'authOpenIDSubfolderForRedirectURLs') updatedValue = null
        let currentValue = currentAuthenticationSettings[key]
        if (currentValue === '' && key != 'authOpenIDSubfolderForRedirectURLs') currentValue = null

        if (updatedValue !== currentValue) {
          Logger.debug(`[MiscController] Updating auth settings key "${key}" from "${currentValue}" to "${updatedValue}"`)
          Database.serverSettings[key] = updatedValue
          hasUpdates = true
        }
      }
    }

    if (hasUpdates) {
      await Database.updateServerSettings()

      // Use/unuse auth methods
      Database.serverSettings.supportedAuthMethods.forEach((authMethod) => {
        if (originalAuthMethods.includes(authMethod) && !Database.serverSettings.authActiveAuthMethods.includes(authMethod)) {
          // Auth method has been removed
          Logger.info(`[MiscController] Disabling active auth method "${authMethod}"`)
          this.auth.unuseAuthStrategy(authMethod)
        } else if (!originalAuthMethods.includes(authMethod) && Database.serverSettings.authActiveAuthMethods.includes(authMethod)) {
          // Auth method has been added
          Logger.info(`[MiscController] Enabling active auth method "${authMethod}"`)
          this.auth.useAuthStrategy(authMethod)
        }
      })
    }

    res.json({
      updated: hasUpdates,
      serverSettings: Database.serverSettings.toJSONForBrowser()
    })
  }

}

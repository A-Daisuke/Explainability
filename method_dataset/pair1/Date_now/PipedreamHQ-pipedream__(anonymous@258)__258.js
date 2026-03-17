function __method_wrapper__() {
      selectedApps.map(async (app) => {
        // Check cache first
        const cachedData = componentsCache[app]
        if (cachedData && isValidCache(cachedData.timestamp)) {
          components.push(...cachedData.components)
          return
        }

        // If not in cache or expired, fetch from API
        const { data: appComponents } = await pd.getComponents({
          app,
          componentType: "action",
          limit: 100,
        })

        // Run individual component fetching in parallel
        const fetchedComponents = await Promise.all(
          appComponents.map(async (_component) => {
            // Check single component cache first
            const cachedComponent = singleComponentCache[_component.key]
            if (cachedComponent && isValidCache(cachedComponent.timestamp)) {
              return cachedComponent.component
            }

            // If not in cache or expired, fetch from API
            const { data: component } = await pd.getComponent({
              key: _component.key,
            })

            // Cache the component
            singleComponentCache[_component.key] = {
              component,
              timestamp: Date.now(),
            }

            return component
          })
        )

        // Cache the components for this app
        componentsCache[app] = {
          components: fetchedComponents,
          timestamp: Date.now(),
        }

        components.push(...fetchedComponents)
      })

}

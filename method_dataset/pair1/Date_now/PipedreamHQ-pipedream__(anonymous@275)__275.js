function __method_wrapper__() {
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

}

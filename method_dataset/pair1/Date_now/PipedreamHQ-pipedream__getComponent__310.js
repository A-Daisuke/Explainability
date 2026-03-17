function __method_wrapper__() {
  async getComponent(key: string) {
    // Check single component cache first
    const cachedComponent = singleComponentCache[key]
    if (cachedComponent && isValidCache(cachedComponent.timestamp)) {
      return cachedComponent.component
    }

    // If not in cache, try to find in app components cache first
    for (const appCache of Object.values(componentsCache)) {
      if (isValidCache(appCache.timestamp)) {
        const component = appCache.components.find((c) => c.key === key)
        if (component) {
          // Cache it in single component cache too
          singleComponentCache[key] = {
            component,
            timestamp: Date.now(),
          }
          return component
        }
      }
    }

    // If still not found, fetch all components and find it
    const components = await this.getComponents()
    return components.find((c) => c.key === key)
  }

}

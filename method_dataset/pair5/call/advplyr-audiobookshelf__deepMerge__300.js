class __C__ {
    deepMerge(target, override) {
      // deep merge the object into the target object
      for (let prop in override) {
        if (override.hasOwnProperty(prop)) {
          if (Object.prototype.toString.call(override[prop]) === '[object Object]') {
            // if the property is a nested object
            target[prop] = this.deepMerge(target[prop], override[prop])
          } else {
            // for regular property
            target[prop] = override[prop]
          }
        }
      }
      return target
    },

}

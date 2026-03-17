  function resolvePropValue(options, props, key, value, instance, isAbsent) {
      const opt = options[key];
      if (opt != null) {
          const hasDefault = hasOwn(opt, 'default');
          // default values
          if (hasDefault && value === undefined) {
              const defaultValue = opt.default;
              if (opt.type !== Function && isFunction(defaultValue)) {
                  const { propsDefaults } = instance;
                  if (key in propsDefaults) {
                      value = propsDefaults[key];
                  }
                  else {
                      setCurrentInstance(instance);
                      value = propsDefaults[key] = defaultValue.call(null, props);
                      unsetCurrentInstance();
                  }
              }
              else {
                  value = defaultValue;
              }
          }
          // boolean casting
          if (opt[0 /* BooleanFlags.shouldCast */]) {
              if (isAbsent && !hasDefault) {
                  value = false;
              }
              else if (opt[1 /* BooleanFlags.shouldCastTrue */] &&
                  (value === '' || value === hyphenate(key))) {
                  value = true;
              }
          }
      }
      return value;
  }

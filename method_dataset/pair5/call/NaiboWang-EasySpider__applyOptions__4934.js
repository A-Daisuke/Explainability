  function applyOptions(instance) {
      const options = resolveMergedOptions(instance);
      const publicThis = instance.proxy;
      const ctx = instance.ctx;
      // do not cache property access on public proxy during state initialization
      shouldCacheAccess = false;
      // call beforeCreate first before accessing other options since
      // the hook may mutate resolved options (#2791)
      if (options.beforeCreate) {
          callHook$1(options.beforeCreate, instance, "bc" /* LifecycleHooks.BEFORE_CREATE */);
      }
      const { 
      // state
      data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, 
      // lifecycle
      created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, 
      // public API
      expose, inheritAttrs, 
      // assets
      components, directives, filters } = options;
      const checkDuplicateProperties = createDuplicateChecker() ;
      {
          const [propsOptions] = instance.propsOptions;
          if (propsOptions) {
              for (const key in propsOptions) {
                  checkDuplicateProperties("Props" /* OptionTypes.PROPS */, key);
              }
          }
      }
      // options initialization order (to be consistent with Vue 2):
      // - props (already done outside of this function)
      // - inject
      // - methods
      // - data (deferred since it relies on `this` access)
      // - computed
      // - watch (deferred since it relies on `this` access)
      if (injectOptions) {
          resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
      }
      if (methods) {
          for (const key in methods) {
              const methodHandler = methods[key];
              if (isFunction(methodHandler)) {
                  // In dev mode, we use the `createRenderContext` function to define
                  // methods to the proxy target, and those are read-only but
                  // reconfigurable, so it needs to be redefined here
                  {
                      Object.defineProperty(ctx, key, {
                          value: methodHandler.bind(publicThis),
                          configurable: true,
                          enumerable: true,
                          writable: true
                      });
                  }
                  {
                      checkDuplicateProperties("Methods" /* OptionTypes.METHODS */, key);
                  }
              }
              else {
                  warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
                      `Did you reference the function correctly?`);
              }
          }
      }
      if (dataOptions) {
          if (!isFunction(dataOptions)) {
              warn(`The data option must be a function. ` +
                  `Plain object usage is no longer supported.`);
          }
          const data = dataOptions.call(publicThis, publicThis);
          if (isPromise(data)) {
              warn(`data() returned a Promise - note data() cannot be async; If you ` +
                  `intend to perform data fetching before component renders, use ` +
                  `async setup() + <Suspense>.`);
          }
          if (!isObject(data)) {
              warn(`data() should return an object.`);
          }
          else {
              instance.data = reactive(data);
              {
                  for (const key in data) {
                      checkDuplicateProperties("Data" /* OptionTypes.DATA */, key);
                      // expose data on ctx during dev
                      if (!isReservedPrefix(key[0])) {
                          Object.defineProperty(ctx, key, {
                              configurable: true,
                              enumerable: true,
                              get: () => data[key],
                              set: NOOP
                          });
                      }
                  }
              }
          }
      }
      // state initialization complete at this point - start caching access
      shouldCacheAccess = true;
      if (computedOptions) {
          for (const key in computedOptions) {
              const opt = computedOptions[key];
              const get = isFunction(opt)
                  ? opt.bind(publicThis, publicThis)
                  : isFunction(opt.get)
                      ? opt.get.bind(publicThis, publicThis)
                      : NOOP;
              if (get === NOOP) {
                  warn(`Computed property "${key}" has no getter.`);
              }
              const set = !isFunction(opt) && isFunction(opt.set)
                  ? opt.set.bind(publicThis)
                  : () => {
                          warn(`Write operation failed: computed property "${key}" is readonly.`);
                      }
                      ;
              const c = computed({
                  get,
                  set
              });
              Object.defineProperty(ctx, key, {
                  enumerable: true,
                  configurable: true,
                  get: () => c.value,
                  set: v => (c.value = v)
              });
              {
                  checkDuplicateProperties("Computed" /* OptionTypes.COMPUTED */, key);
              }
          }
      }
      if (watchOptions) {
          for (const key in watchOptions) {
              createWatcher(watchOptions[key], ctx, publicThis, key);
          }
      }
      if (provideOptions) {
          const provides = isFunction(provideOptions)
              ? provideOptions.call(publicThis)
              : provideOptions;
          Reflect.ownKeys(provides).forEach(key => {
              provide(key, provides[key]);
          });
      }
      if (created) {
          callHook$1(created, instance, "c" /* LifecycleHooks.CREATED */);
      }
      function registerLifecycleHook(register, hook) {
          if (isArray(hook)) {
              hook.forEach(_hook => register(_hook.bind(publicThis)));
          }
          else if (hook) {
              register(hook.bind(publicThis));
          }
      }
      registerLifecycleHook(onBeforeMount, beforeMount);
      registerLifecycleHook(onMounted, mounted);
      registerLifecycleHook(onBeforeUpdate, beforeUpdate);
      registerLifecycleHook(onUpdated, updated);
      registerLifecycleHook(onActivated, activated);
      registerLifecycleHook(onDeactivated, deactivated);
      registerLifecycleHook(onErrorCaptured, errorCaptured);
      registerLifecycleHook(onRenderTracked, renderTracked);
      registerLifecycleHook(onRenderTriggered, renderTriggered);
      registerLifecycleHook(onBeforeUnmount, beforeUnmount);
      registerLifecycleHook(onUnmounted, unmounted);
      registerLifecycleHook(onServerPrefetch, serverPrefetch);
      if (isArray(expose)) {
          if (expose.length) {
              const exposed = instance.exposed || (instance.exposed = {});
              expose.forEach(key => {
                  Object.defineProperty(exposed, key, {
                      get: () => publicThis[key],
                      set: val => (publicThis[key] = val)
                  });
              });
          }
          else if (!instance.exposed) {
              instance.exposed = {};
          }
      }
      // options that are handled when creating the instance but also need to be
      // applied from mixins
      if (render && instance.render === NOOP) {
          instance.render = render;
      }
      if (inheritAttrs != null) {
          instance.inheritAttrs = inheritAttrs;
      }
      // asset options.
      if (components)
          instance.components = components;
      if (directives)
          instance.directives = directives;
  }

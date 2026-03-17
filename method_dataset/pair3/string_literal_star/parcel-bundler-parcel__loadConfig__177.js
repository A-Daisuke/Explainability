class __C__ {
  async loadConfig({config, options}) {
    let pkg = await config.getPackage();
    let isJSX,
      pragma,
      pragmaFrag,
      jsxImportSource,
      automaticJSXRuntime,
      reactRefresh,
      decorators,
      useDefineForClassFields;
    if (config.isSource) {
      let reactLib;
      if (pkg?.alias && pkg.alias['react']) {
        // e.g.: `{ alias: { "react": "preact/compat" } }`
        reactLib = 'react';
      } else {
        // Find a dependency that we can map to a JSX pragma
        reactLib = Object.keys(JSX_PRAGMA).find(
          libName =>
            pkg?.dependencies?.[libName] ||
            pkg?.devDependencies?.[libName] ||
            pkg?.peerDependencies?.[libName],
        );
      }

      reactRefresh =
        options.hmrOptions &&
        options.mode === 'development' &&
        Boolean(
          pkg?.dependencies?.react ||
            pkg?.devDependencies?.react ||
            pkg?.peerDependencies?.react,
        );

      let tsconfig = await config.getConfigFrom<TSConfig>(
        options.projectRoot + '/index',
        ['tsconfig.json', 'jsconfig.json'],
      );
      let compilerOptions = tsconfig?.contents?.compilerOptions;

      // Use explicitly defined JSX options in tsconfig.json over inferred values from dependencies.
      pragma =
        compilerOptions?.jsxFactory ||
        (reactLib ? JSX_PRAGMA[reactLib].pragma : undefined);
      pragmaFrag =
        compilerOptions?.jsxFragmentFactory ||
        (reactLib ? JSX_PRAGMA[reactLib].pragmaFrag : undefined);

      if (
        compilerOptions?.jsx === 'react-jsx' ||
        compilerOptions?.jsx === 'react-jsxdev' ||
        compilerOptions?.jsxImportSource
      ) {
        jsxImportSource = compilerOptions?.jsxImportSource;
        automaticJSXRuntime = true;
      } else if (reactLib) {
        let effectiveReactLib =
          pkg?.alias && pkg.alias['react'] === 'preact/compat'
            ? 'preact'
            : reactLib;
        let reactLibVersion =
          pkg?.dependencies?.[effectiveReactLib] ||
          pkg?.devDependencies?.[effectiveReactLib] ||
          pkg?.peerDependencies?.[effectiveReactLib];
        if (effectiveReactLib === 'react' && reactLibVersion === 'canary') {
          automaticJSXRuntime = true;
        } else {
          let automaticVersion = JSX_PRAGMA[effectiveReactLib]?.automatic;
          reactLibVersion = reactLibVersion
            ? semver.validRange(reactLibVersion)
            : null;
          let minReactLibVersion =
            reactLibVersion !== null && reactLibVersion !== '*'
              ? semver.minVersion(reactLibVersion)?.toString()
              : null;

          automaticJSXRuntime =
            automaticVersion &&
            !compilerOptions?.jsxFactory &&
            minReactLibVersion != null &&
            semver.satisfies(minReactLibVersion, automaticVersion, {
              includePrerelease: true,
            });
        }

        jsxImportSource = reactLib;
      }

      isJSX = Boolean(compilerOptions?.jsx || pragma);
      decorators = compilerOptions?.experimentalDecorators;
      useDefineForClassFields = compilerOptions?.useDefineForClassFields;
      if (
        useDefineForClassFields === undefined &&
        compilerOptions?.target != null
      ) {
        // Default useDefineForClassFields to true if target is ES2022 or higher (including ESNext)
        let target = compilerOptions.target.slice(2);
        if (target === 'next') {
          useDefineForClassFields = true;
        } else {
          useDefineForClassFields = Number(target) >= 2022;
        }
      }
    }

    // Check if we should ignore fs calls
    // See https://github.com/defunctzombie/node-browser-resolve#skip
    let ignoreFS =
      pkg &&
      pkg.browser &&
      typeof pkg.browser === 'object' &&
      pkg.browser.fs === false;

    let conf = await config.getConfigFrom(options.projectRoot + '/index', [], {
      packageKey: '@parcel/transformer-js',
    });

    let inlineEnvironment = config.isSource;
    let inlineFS = !ignoreFS;
    let inlineConstants = false;
    if (conf && conf.contents) {
      validateSchema.diagnostic(
        CONFIG_SCHEMA,
        {
          data: conf.contents,
          // FIXME
          source: await options.inputFS.readFile(conf.filePath, 'utf8'),
          filePath: conf.filePath,
          prependKey: `/${encodeJSONKeyComponent('@parcel/transformer-js')}`,
        },
        // FIXME
        '@parcel/transformer-js',
        'Invalid config for @parcel/transformer-js',
      );

      inlineEnvironment = conf.contents?.inlineEnvironment ?? inlineEnvironment;
      inlineFS = conf.contents?.inlineFS ?? inlineFS;
      inlineConstants =
        conf.contents?.unstable_inlineConstants ?? inlineConstants;
    }

    return {
      isJSX,
      automaticJSXRuntime,
      jsxImportSource,
      pragma,
      pragmaFrag,
      inlineEnvironment,
      inlineFS,
      inlineConstants,
      reactRefresh,
      decorators,
      useDefineForClassFields,
    };
  },

}

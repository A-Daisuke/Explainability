function __method_wrapper__() {
        ? async (err, src, exportName, args, loc) => {
            let mod;
            try {
              mod = await options.packageManager.require(src, asset.filePath);

              // Default interop for CommonJS modules.
              if (
                exportName === 'default' &&
                !mod.__esModule &&
                // $FlowFixMe
                Object.prototype.toString.call(config) !== '[object Module]'
              ) {
                mod = {default: mod};
              }

              if (!Object.hasOwnProperty.call(mod, exportName)) {
                throw new Error(`"${src}" does not export "${exportName}".`);
              }
            } catch (err) {
              throw {
                kind: 1,
                message: err.message,
              };
            }

            try {
              if (typeof mod[exportName] === 'function') {
                let ctx: MacroContext = {
                  // Allows macros to emit additional assets to add as dependencies (e.g. css).
                  addAsset(a: MacroAsset) {
                    let k =
                      (asset.uniqueKey ? asset.uniqueKey + ':' : '') +
                      String(macroAssets.length);
                    let map;
                    if (asset.env.sourceMap) {
                      // Generate a source map that maps each line of the asset to the original macro call.
                      map = new SourceMap(options.projectRoot);
                      let mappings = [];
                      let line = 1;
                      for (let i = 0; i <= a.content.length; i++) {
                        if (i === a.content.length || a.content[i] === '\n') {
                          mappings.push({
                            generated: {
                              line,
                              column: 0,
                            },
                            source: asset.filePath,
                            original: {
                              line: loc.line,
                              column: loc.col,
                            },
                          });
                          line++;
                        }
                      }

                      map.addIndexedMappings(mappings);
                      if (originalMap) {
                        map.extends(originalMap);
                      } else {
                        map.setSourceContent(asset.filePath, code.toString());
                      }
                    }

                    macroAssets.push({
                      type: a.type,
                      content: a.content,
                      map,
                      uniqueKey: k,
                      bundleBehavior: null,
                    });

                    asset.addDependency({
                      specifier: k,
                      specifierType: 'esm',
                    });
                  },
                  loc: {
                    filePath: asset.filePath,
                    start: {
                      line:
                        loc.start_line + Number(asset.meta.startLine ?? 1) - 1,
                      column: loc.start_col,
                    },
                    end: {
                      line:
                        loc.end_line + Number(asset.meta.startLine ?? 1) - 1,
                      column: loc.end_col,
                    },
                  },
                  invalidateOnFileChange(filePath) {
                    asset.invalidateOnFileChange(filePath);
                  },
                  invalidateOnFileCreate(invalidation) {
                    asset.invalidateOnFileCreate(invalidation);
                  },
                  invalidateOnEnvChange(env) {
                    asset.invalidateOnEnvChange(env);
                  },
                  invalidateOnStartup() {
                    asset.invalidateOnStartup();
                  },
                  invalidateOnBuild() {
                    asset.invalidateOnBuild();
                  },
                };

                return mod[exportName].apply(ctx, args);
              } else {
                throw new Error(
                  `"${exportName}" in "${src}" is not a function.`,
                );
              }
            } catch (err) {
              // Remove parcel core from stack and build string so Rust can process errors more easily.
              let stack = (err.stack || '').split('\n').slice(1);
              let message = err.message;
              for (let line of stack) {
                if (line.includes(__filename)) {
                  break;
                }
                message += '\n' + line;
              }
              throw {
                kind: 2,
                message,
              };
            }
          }

}

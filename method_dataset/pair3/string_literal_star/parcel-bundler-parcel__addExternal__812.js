function __method_wrapper__() {
  addExternal(
    dep: Dependency,
    replacements?: Map<string, string>,
    referencedBundle?: NamedBundle,
  ) {
    if (this.bundle.env.outputFormat === 'global') {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message:
            'External modules are not supported when building for browser',
          codeFrames: [
            {
              filePath: nullthrows(dep.sourcePath),
              codeHighlights: dep.loc
                ? [convertSourceLocationToHighlight(dep.loc)]
                : [],
            },
          ],
        },
      });
    }

    let specifier = dep.specifier;
    if (referencedBundle) {
      specifier = relativeBundlePath(this.bundle, referencedBundle);
    }

    // Map of DependencySpecifier -> Map<ExportedSymbol, Identifier>>
    let external = this.externals.get(specifier);
    if (!external) {
      external = new Map();
      this.externals.set(specifier, external);
    }

    for (let [imported, {local}] of dep.symbols) {
      // If already imported, just add the already renamed variable to the mapping.
      let renamed = external.get(imported);
      if (renamed && local !== '*' && replacements) {
        replacements.set(local, renamed);
        continue;
      }

      // For CJS output, always use a property lookup so that exports remain live.
      // For ESM output, use named imports which are always live.
      if (this.bundle.env.outputFormat === 'commonjs') {
        renamed = external.get('*');
        if (!renamed) {
          if (referencedBundle) {
            let entry = nullthrows(referencedBundle.getMainEntry());
            renamed =
              entry.symbols.get('*')?.local ??
              `$${String(entry.meta.id)}$exports`;
          } else {
            renamed = this.getTopLevelName(
              `$${this.bundle.publicId}$${specifier}`,
            );
          }

          external.set('*', renamed);
        }

        if (local !== '*' && replacements) {
          let replacement;
          if (imported === '*') {
            replacement = renamed;
          } else if (imported === 'default') {
            let needsDefaultInterop = true;
            if (referencedBundle) {
              let entry = nullthrows(referencedBundle.getMainEntry());
              needsDefaultInterop = this.needsDefaultInterop(entry);
            }
            if (needsDefaultInterop) {
              replacement = `($parcel$interopDefault(${renamed}))`;
              this.usedHelpers.add('$parcel$interopDefault');
            } else {
              replacement = `${renamed}.default`;
            }
          } else {
            replacement = this.getPropertyAccess(renamed, imported);
          }

          replacements.set(local, replacement);
        }
      } else {
        let property;
        if (referencedBundle) {
          let entry = nullthrows(referencedBundle.getMainEntry());
          if (entry.symbols.hasExportSymbol('*')) {
            // If importing * and the referenced module has a * export (e.g. CJS), use default instead.
            // This mirrors the logic in buildExportedSymbols.
            property = imported;
            imported =
              referencedBundle?.env.outputFormat === 'esmodule'
                ? 'default'
                : '*';
          } else {
            if (imported === '*') {
              let exportedSymbols = this.bundleGraph.getExportedSymbols(entry);
              if (local === '*') {
                // Re-export all symbols.
                for (let exported of exportedSymbols) {
                  if (exported.symbol) {
                    external.set(exported.exportSymbol, exported.symbol);
                  }
                }
                continue;
              }
            }
            renamed = this.bundleGraph.getSymbolResolution(
              entry,
              imported,
              this.bundle,
            ).symbol;
          }
        }

        // Rename the specifier so that multiple local imports of the same imported specifier
        // are deduplicated. We have to prefix the imported name with the bundle id so that
        // local variables do not shadow it.
        if (!renamed) {
          if (this.exportedSymbols.has(local)) {
            renamed = local;
          } else if (imported === 'default' || imported === '*') {
            renamed = this.getTopLevelName(
              `$${this.bundle.publicId}$${specifier}`,
            );
          } else {
            renamed = this.getTopLevelName(
              `$${this.bundle.publicId}$${imported}`,
            );
          }
        }

        external.set(imported, renamed);
        if (local !== '*' && replacements) {
          let replacement = renamed;
          if (property === '*') {
            replacement = renamed;
          } else if (property === 'default') {
            replacement = `($parcel$interopDefault(${renamed}))`;
            this.usedHelpers.add('$parcel$interopDefault');
          } else if (property) {
            replacement = this.getPropertyAccess(renamed, property);
          }
          replacements.set(local, replacement);
        }
      }
    }
  }

}

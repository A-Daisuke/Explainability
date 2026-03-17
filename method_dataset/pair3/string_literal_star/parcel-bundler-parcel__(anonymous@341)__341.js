function __method_wrapper__() {
        .map(([n, {type, imported, exported}]) => {
          let importStatements = [];
          let otherStatements = [];
          let exportStatements = [];

          for (let s of imported) {
            if (s.symbol === '*') {
              importStatements.push(
                TEMPLATES[type].IMPORT_NAMESPACE({
                  local: t.identifier(s.as),
                  source: t.stringLiteral(
                    './' + numberToFilename(s.from, state.modules[s.from].type),
                  ),
                }),
              );
            } else {
              importStatements.push(
                TEMPLATES[type].IMPORT_NAMED({
                  name: t.identifier(s.symbol),
                  local: t.identifier(s.as),
                  source: t.stringLiteral(
                    './' + numberToFilename(s.from, state.modules[s.from].type),
                  ),
                }),
              );
            }
          }
          for (let s of exported) {
            if (s.from == null) {
              if (s.symbol === s.as) {
                exportStatements.push(
                  TEMPLATES[type].EXPORT_CONST({
                    name: t.identifier(s.symbol),
                    value: t.stringLiteral(nanoid(5)),
                  }),
                );
              } else {
                otherStatements.push(
                  TEMPLATES[type].CONST({
                    name: t.identifier(s.symbol),
                    value: t.stringLiteral(nanoid(5)),
                  }),
                );
                exportStatements.push(
                  TEMPLATES[type].EXPORT_NAMED({
                    local: t.identifier(s.symbol),
                    name: t.identifier(s.as),
                  }),
                );
              }
            } else {
              let from = nullthrows(s.from);
              if (s.symbol === '*') {
                if (s.as === '*') {
                  exportStatements.push(
                    TEMPLATES[type].REEXPORT_NAMESPACE({
                      source: t.stringLiteral(
                        './' + numberToFilename(from, state.modules[from].type),
                      ),
                    }),
                  );
                } else {
                  exportStatements.push(
                    TEMPLATES[type].REEXPORT_NAMESPACE_AS({
                      name: t.identifier(s.as),
                      source: t.stringLiteral(
                        './' + numberToFilename(from, state.modules[from].type),
                      ),
                    }),
                  );
                }
              } else {
                exportStatements.push(
                  TEMPLATES[type].REEXPORT_NAMED({
                    local: t.identifier(s.symbol),
                    name: t.identifier(s.as),
                    source: t.stringLiteral(
                      './' + numberToFilename(from, state.modules[from].type),
                    ),
                  }),
                );
              }
            }
          }

          return [
            `${n}.${type}`,
            generate(
              t.program([
                ...importStatements,
                ...otherStatements,
                ...exportStatements,
              ]),
            ).code,
          ];
        })

}

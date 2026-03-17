function generateImports(factory: any, moduleGraph: TSModuleGraph) {
  let importStatements = [];
  for (let [specifier, names] of moduleGraph.getAllImports()) {
    let defaultSpecifier;
    let namespaceSpecifier;
    let namedSpecifiers = [];
    for (let [name, imported] of names) {
      if (imported === 'default') {
        defaultSpecifier = factory.createIdentifier(name);
      } else if (imported === '*') {
        namespaceSpecifier = factory.createNamespaceImport(
          factory.createIdentifier(name),
        );
      } else {
        namedSpecifiers.push(
          createImportSpecifier(
            factory,
            false,
            name === imported ? undefined : factory.createIdentifier(imported),
            factory.createIdentifier(name),
          ),
        );
      }
    }

    if (namespaceSpecifier) {
      let importClause = createImportClause(
        factory,
        false,
        defaultSpecifier,
        namespaceSpecifier,
      );
      importStatements.push(
        createImportDeclaration(
          factory,
          undefined,
          importClause,
          factory.createStringLiteral(specifier),
          undefined,
        ),
      );
      defaultSpecifier = undefined;
    }

    if (defaultSpecifier || namedSpecifiers.length > 0) {
      let importClause = createImportClause(
        factory,
        false,
        defaultSpecifier,
        namedSpecifiers.length > 0
          ? factory.createNamedImports(namedSpecifiers)
          : undefined,
      );
      importStatements.push(
        createImportDeclaration(
          factory,
          undefined,
          importClause,
          factory.createStringLiteral(specifier),
          undefined,
        ),
      );
    }
  }

  return importStatements;
}

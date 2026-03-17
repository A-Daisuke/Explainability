function getImportName(
  qualifier: ?EntityName,
  local: string,
  factory: typeof ts,
) {
  if (!qualifier) {
    return ['*', factory.createIdentifier(local)];
  }

  if (qualifier.kind === ts.SyntaxKind.Identifier) {
    return [qualifier.text, factory.createIdentifier(local)];
  }

  let [name, entity] = getImportName(qualifier.left, local, factory);
  return [name, factory.createQualifiedName(entity, qualifier.right)];
}

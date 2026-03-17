function __method_wrapper__() {
    mapVector(extension.getExtensionObjectsTypes(), objectType => {
      const objectMetadata = extension.getObjectMetadata(objectType);
      const scope = {
        extension: { name: extension.getName() },
        objectMetadata: {
          name: objectMetadata.getName(),
          isPrivate: objectMetadata.isPrivate(),
        },
      };

      if (!shouldOnlyBeNumberType(type))
        objectsExpressions.push.apply(
          objectsExpressions,
          enumerateExpressionMetadataMap(
            prefix,
            extension.getAllStrExpressionsForObject(objectType),
            scope
          )
        );
      objectsExpressions.push.apply(
        objectsExpressions,
        enumerateExpressionMetadataMap(
          prefix,
          extension.getAllExpressionsForObject(objectType),
          scope
        )
      );
    });

}

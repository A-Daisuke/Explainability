function __method_wrapper__() {
    mapVector(extension.getBehaviorsTypes(), behaviorType => {
      const behaviorMetadata = extension.getBehaviorMetadata(behaviorType);
      const scope = {
        extension: { name: extension.getName() },
        behaviorMetadata: {
          name: behaviorMetadata.getName(),
          isPrivate: behaviorMetadata.isPrivate(),
        },
      };

      if (!shouldOnlyBeNumberType(type))
        behaviorsExpressions.push.apply(
          behaviorsExpressions,
          enumerateExpressionMetadataMap(
            prefix,
            extension.getAllStrExpressionsForBehavior(behaviorType),
            scope
          )
        );
      behaviorsExpressions.push.apply(
        behaviorsExpressions,
        enumerateExpressionMetadataMap(
          prefix,
          extension.getAllExpressionsForBehavior(behaviorType),
          scope
        )
      );
    });

}

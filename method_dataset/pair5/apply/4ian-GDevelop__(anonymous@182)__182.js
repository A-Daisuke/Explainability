function __method_wrapper__() {
  mapVector(behaviorNames, behaviorName => {
    const behaviorType = projectScopedContainers
      .getObjectsContainersList()
      .getTypeOfBehaviorInObjectOrGroup(objectName, behaviorName, true);
    if (!behaviorType) {
      return;
    }
    const behaviorExpressions = enumerateBehaviorExpressions(
      type,
      behaviorType
    );
    const filteredBehaviorExpressions = filterEnumeratedInstructionOrExpressionMetadataByScope(
      filterExpressions(behaviorExpressions, prefix),
      expressionAutocompletionContext.scope
    );
    const behaviorExpressionAutocompletions = getAutocompletionsForExpressions(
      filteredBehaviorExpressions,
      prefix,
      completionDescription.getReplacementStartPosition(),
      completionDescription.getReplacementEndPosition(),
      isExact,
      type
    );
    behaviorExpressionAutocompletions.forEach(autocompletion => {
      autocompletion.completion =
        behaviorName +
        gd.PlatformExtension.getNamespaceSeparator() +
        autocompletion.completion;
    });
    autocompletions.push.apply(
      autocompletions,
      behaviorExpressionAutocompletions
    );
  });

}

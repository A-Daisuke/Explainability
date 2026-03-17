function __method_wrapper__() {
    behaviorTypes.forEach(behaviorType => {
      const behaviorMetadata = extension.getBehaviorMetadata(behaviorType);
      const scope = {
        extension: { name: extension.getName() },
        behaviorMetadata: {
          name: behaviorMetadata.getName(),
          isPrivate: behaviorMetadata.isPrivate(),
        },
      };

      // Free functions can require a behavior even if this behavior is from
      // another extension.
      const freeBehaviorInstructions: Array<EnumeratedInstructionMetadata> = [];
      for (let i = 0; i < allExtensions.size(); ++i) {
        const extension = allExtensions.at(i);
        freeBehaviorInstructions.push.apply(
          freeBehaviorInstructions,
          enumerateExtraBehaviorInstructions(
            isCondition,
            extension,
            behaviorType,
            prefix,
            scope,
            i18n
          )
        );
      }

      // Show them at the top of the list.
      allInstructions = [
        ...enumerateExtensionInstructions(
          prefix,
          isCondition
            ? extension.getAllConditionsForBehavior(behaviorType)
            : extension.getAllActionsForBehavior(behaviorType),
          scope,
          i18n,
          // Allow behaviors to have some of their instruction to be restricted
          // to some type of object.
          objectType,
          objectBehaviorTypes
        ),
        ...freeBehaviorInstructions,
        ...allInstructions,
      ];
    });

}

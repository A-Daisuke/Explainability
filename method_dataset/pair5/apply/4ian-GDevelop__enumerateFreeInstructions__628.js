export const enumerateFreeInstructions = (
  isCondition: boolean,
  i18n: I18nType
): Array<EnumeratedInstructionMetadata> => {
  let allFreeInstructions = [];

  const allExtensions = gd
    .asPlatform(gd.JsPlatform.get())
    .getAllPlatformExtensions();
  for (let i = 0; i < allExtensions.size(); ++i) {
    const extension = allExtensions.at(i);

    allFreeInstructions.push.apply(
      allFreeInstructions,
      enumerateFreeInstructionsWithoutExtra(
        isCondition,
        extension,
        {
          extension: { name: extension.getName() },
          objectMetadata: undefined,
          behaviorMetadata: undefined,
        },
        i18n
      )
    );
  }
  return allFreeInstructions;
};

  const getProjectSpecificExtensionsSummary = (
    project: gdProject
  ): ProjectSpecificExtensionsSummary => {
    const startTime = Date.now();
    const platform = project.getCurrentPlatform();
    const allExtensions = platform.getAllPlatformExtensions();

    const projectExtensionNames = new Set(
      mapFor(0, project.getEventsFunctionsExtensionsCount(), i => {
        const extension = project.getEventsFunctionsExtensionAt(i);
        return extension.getName();
      })
    );

    const projectSpecificExtensions: Array<gdPlatformExtension> = mapVector(
      allExtensions,
      extension => {
        if (projectExtensionNames.has(extension.getName())) {
          return extension;
        }
        return null;
      }
    ).filter(Boolean);

    const extensionsSummary: ProjectSpecificExtensionsSummary = {
      extensionSummaries: projectSpecificExtensions.map(extension =>
        buildExtensionSummary({ gd, extension })
      ),
    };

    const duration = Date.now() - startTime;
    console.info(
      `Project specific extensions summary generated in ${duration.toFixed(
        0
      )}ms`
    );

    return extensionsSummary;
  };

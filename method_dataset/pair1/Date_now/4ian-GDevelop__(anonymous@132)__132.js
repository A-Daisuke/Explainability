function __method_wrapper__() {
) => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  properties: {| name?: string, gameId?: string |}
): Promise<null | {| version: string, lastModifiedDate: number |}> => {
  if (!authenticatedUser.authenticated) return null;
  try {
    await updateCloudProject(
      authenticatedUser,
      fileMetadata.fileIdentifier,
      properties
    );
    const newVersion = await zipProjectAndCommitVersion({
      authenticatedUser,
      project,
      cloudProjectId: fileMetadata.fileIdentifier,
    });
    if (!newVersion) {
      throw new Error("Couldn't save project following property update.");
    }

    return { version: newVersion, lastModifiedDate: Date.now() };
  } catch (error) {
    // TODO: Determine if a feedback should be given to user so that they can try again if necessary.
    console.warn(
      'An error occurred while changing cloud project name. Ignoring.',
      error
    );
    return null;
  }
};

}

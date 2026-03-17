function __method_wrapper__() {
) => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  options?: {| previousVersion?: string, restoredFromVersionId?: string |}
) => {
  const cloudProjectId = fileMetadata.fileIdentifier;
  const gameId = project.getProjectUuid();
  const now = Date.now();

  if (!fileMetadata.gameId) {
    console.info('Game id was never set, updating the cloud project.');
    try {
      await updateCloudProject(authenticatedUser, cloudProjectId, {
        gameId,
      });
    } catch (error) {
      console.error('Could not update cloud project with gameId', error);
      // Do not throw, as this is not a blocking error.
    }
  }
  const newVersion = await zipProjectAndCommitVersion({
    authenticatedUser,
    project,
    cloudProjectId,
    options,
  });

  const newFileMetadata: FileMetadata = {
    ...fileMetadata,
    gameId,
    // lastModifiedDate is set here even though it will be set by backend services.
    // Regarding the list of cloud projects in the build section, it should not have
    // an impact since the 2 dates are not used for the same purpose.
    // But it's better to have an up-to-date current file metadata (used by the version
    // history to know when to refresh the most recent version).
    lastModifiedDate: now,
  };
  if (!newVersion) return { wasSaved: false, fileMetadata: newFileMetadata };

  // Save the version being modified in the file metadata, so that it can be
  // used when saving to compare with the last version of the project, and
  // raise a conflict warning if different.
  newFileMetadata.version = newVersion;
  return {
    wasSaved: true,
    fileMetadata: newFileMetadata,
  };
};

}

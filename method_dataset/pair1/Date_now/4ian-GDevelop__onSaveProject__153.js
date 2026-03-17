export const onSaveProject = async (
  project: gdProject,
  fileMetadata: FileMetadata
): Promise<{|
  wasSaved: boolean,
  fileMetadata: FileMetadata,
|}> => {
  const filePath = fileMetadata.fileIdentifier;
  const now = Date.now();
  if (!filePath) {
    throw new Error('Unable to find file path before saving.');
  }
  // Ensure we always pick the latest name and gameId.
  const newFileMetadata = {
    ...fileMetadata,
    name: project.getName(),
    gameId: project.getProjectUuid(),
    lastModifiedDate: now,
  };

  const projectPath = path.dirname(filePath);

  try {
    deleteExistingFilesFromDirs(project, projectPath);
  } catch (e) {
    console.warn('Unable to clean project folder before saving project: ', e);
  }

  await writeProjectFiles(project, filePath, projectPath);
  return {
    wasSaved: true,
    fileMetadata: newFileMetadata,
  };
};

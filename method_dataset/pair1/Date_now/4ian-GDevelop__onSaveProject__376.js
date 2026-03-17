function __method_wrapper__() {
      onSaveProject: (project: gdProject, fileMetadata: FileMetadata) => {
        const fileId = fileMetadata.fileIdentifier;
        const newFileMetadata = {
          ...fileMetadata,
          lastModifiedDate: Date.now(),
        };

        const content = serializeToJSON(project);
        return authenticate()
          .then(googleUser => patchJsonFile(fileId, googleUser, content))
          .then(() => ({
            wasSaved: true,
            fileMetadata: newFileMetadata,
          }));
      },

}

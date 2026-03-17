class __C__ {
  async run({ $ }) {
    // Create Doc
    const { documentId } = await this.googleDocs.createEmptyDoc(this.title);

    // Insert text
    if (this.text) {
      await this.googleDocs.insertText(documentId, {
        text: this.text,
      });
    }

    // Move file
    if (this.folderId) {
    // Get file to get parents to remove
      const file = await this.googleDocs.getFile(documentId);

      // Move file, removing old parents, adding new parent folder
      await this.googleDocs.updateFile(documentId, {
        fields: "*",
        removeParents: file.parents.join(","),
        addParents: this.folderId,
      });
    }

    // Get updated doc resource to return
    const doc = await this.googleDocs.getDocument(documentId);

    $.export("$summary", `Successfully created document with ID: ${documentId}`);
    return doc;
  },

}

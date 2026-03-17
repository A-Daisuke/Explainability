class __C__ {
  _getClient() {
    this._lastUsedTime = Date.now();
    if (!this._client) {
      this._worker = monaco_editor_core_exports.editor.createWebWorker({
        // module that exports the create() method and returns a `JSONWorker` instance
        moduleId: "vs/language/json/jsonWorker",
        label: this._defaults.languageId,
        // passed in to the create() method
        createData: {
          languageSettings: this._defaults.diagnosticsOptions,
          languageId: this._defaults.languageId,
          enableSchemaRequest: this._defaults.diagnosticsOptions.enableSchemaRequest
        }
      });
      this._client = this._worker.getProxy();
    }
    return this._client;
  }

}

function __method_wrapper__() {
    constructor(modelService, configurationService, logService, languageConfigurationService, languageFeaturesService) {
        super();
        this._modelService = modelService;
        this._workerManager = this._register(new WorkerManager(this._modelService, languageConfigurationService));
        this._logService = logService;
        // register default link-provider and default completions-provider
        this._register(languageFeaturesService.linkProvider.register({ language: '*', hasAccessToAllModels: true }, {
            provideLinks: (model, token) => {
                if (!canSyncModel(this._modelService, model.uri)) {
                    return Promise.resolve({ links: [] }); // File too large
                }
                return this._workerManager.withWorker().then(client => client.computeLinks(model.uri)).then(links => {
                    return links && { links };
                });
            }
        }));
        this._register(languageFeaturesService.completionProvider.register('*', new WordBasedCompletionItemProvider(this._workerManager, configurationService, this._modelService, languageConfigurationService)));
    }

}

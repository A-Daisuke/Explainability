        const p = createCancelablePromise(async (token) => {
            const editor = this._editor;
            if (!editor.hasModel()) {
                return;
            }
            const model = editor.getModel();
            const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */ | 2 /* CodeEditorStateFlag.Selection */, undefined, token);
            try {
                await this.mergeInDataFromCopy(dataTransfer, metadata, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                // Filter out any providers the don't match the full data transfer we will send them.
                let supportedProviders = allProviders.filter(provider => this.isSupportedPasteProvider(provider, dataTransfer, preference));
                if (preference) {
                    // We are looking for a specific edit
                    supportedProviders = supportedProviders.filter(provider => this.providerMatchesPreference(provider, preference));
                }
                const context = {
                    triggerKind: DocumentPasteTriggerKind.PasteAs,
                    only: preference && preference instanceof HierarchicalKind ? preference : undefined,
                };
                let providerEdits = await this.getPasteEdits(supportedProviders, dataTransfer, model, selections, context, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                // Filter out any edits that don't match the requested kind
                if (preference) {
                    providerEdits = providerEdits.filter(edit => {
                        if (preference instanceof HierarchicalKind) {
                            return preference.contains(edit.kind);
                        }
                        else {
                            return preference.providerId === edit.provider.id;
                        }
                    });
                }
                if (!providerEdits.length) {
                    if (context.only) {
                        this.showPasteAsNoEditMessage(selections, context.only);
                    }
                    return;
                }
                let pickedEdit;
                if (preference) {
                    pickedEdit = providerEdits.at(0);
                }
                else {
                    const selected = await this._quickInputService.pick(providerEdits.map((edit) => {
                        var _a;
                        return ({
                            label: edit.title,
                            description: (_a = edit.kind) === null || _a === void 0 ? void 0 : _a.value,
                            edit,
                        });
                    }), {
                        placeHolder: localize('pasteAsPickerPlaceholder', "Select Paste Action"),
                    });
                    pickedEdit = selected === null || selected === void 0 ? void 0 : selected.edit;
                }
                if (!pickedEdit) {
                    return;
                }
                const combinedWorkspaceEdit = createCombinedWorkspaceEdit(model.uri, selections, pickedEdit);
                await this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor });
            }
            finally {
                tokenSource.dispose();
                if (this._currentPasteOperation === p) {
                    this._currentPasteOperation = undefined;
                }
            }
        });

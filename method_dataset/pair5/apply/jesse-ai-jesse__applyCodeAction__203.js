export async function applyCodeAction(accessor, item, codeActionReason, options, token = CancellationToken.None) {
    var _a;
    const bulkEditService = accessor.get(IBulkEditService);
    const commandService = accessor.get(ICommandService);
    const telemetryService = accessor.get(ITelemetryService);
    const notificationService = accessor.get(INotificationService);
    telemetryService.publicLog2('codeAction.applyCodeAction', {
        codeActionTitle: item.action.title,
        codeActionKind: item.action.kind,
        codeActionIsPreferred: !!item.action.isPreferred,
        reason: codeActionReason,
    });
    await item.resolve(token);
    if (token.isCancellationRequested) {
        return;
    }
    if ((_a = item.action.edit) === null || _a === void 0 ? void 0 : _a.edits.length) {
        const result = await bulkEditService.apply(item.action.edit, {
            editor: options === null || options === void 0 ? void 0 : options.editor,
            label: item.action.title,
            quotableLabel: item.action.title,
            code: 'undoredo.codeAction',
            respectAutoSaveConfig: codeActionReason !== ApplyCodeActionReason.OnSave,
            showPreview: options === null || options === void 0 ? void 0 : options.preview,
        });
        if (!result.isApplied) {
            return;
        }
    }
    if (item.action.command) {
        try {
            await commandService.executeCommand(item.action.command.id, ...(item.action.command.arguments || []));
        }
        catch (err) {
            const message = asMessage(err);
            notificationService.error(typeof message === 'string'
                ? message
                : nls.localize('applyCodeActionFailed', "An unknown error occurred while applying the code action"));
        }
    }
}

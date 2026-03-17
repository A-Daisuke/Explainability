function __method_wrapper__() {
    async applyEditAndShowIfNeeded(ranges, edits, canShowWidget, resolve, token) {
        const model = this._editor.getModel();
        if (!model || !ranges.length) {
            return;
        }
        const edit = edits.allEdits.at(edits.activeEditIndex);
        if (!edit) {
            return;
        }
        const onDidSelectEdit = async (newEditIndex) => {
            const model = this._editor.getModel();
            if (!model) {
                return;
            }
            await model.undo();
            this.applyEditAndShowIfNeeded(ranges, { activeEditIndex: newEditIndex, allEdits: edits.allEdits }, canShowWidget, resolve, token);
        };
        const handleError = (e, message) => {
            if (isCancellationError(e)) {
                return;
            }
            this._notificationService.error(message);
            if (canShowWidget) {
                this.show(ranges[0], edits, onDidSelectEdit);
            }
        };
        let resolvedEdit;
        try {
            resolvedEdit = await resolve(edit, token);
        }
        catch (e) {
            return handleError(e, localize('resolveError', "Error resolving edit '{0}':\n{1}", edit.title, toErrorMessage(e)));
        }
        if (token.isCancellationRequested) {
            return;
        }
        const combinedWorkspaceEdit = createCombinedWorkspaceEdit(model.uri, ranges, resolvedEdit);
        // Use a decoration to track edits around the trigger range
        const primaryRange = ranges[0];
        const editTrackingDecoration = model.deltaDecorations([], [{
                range: primaryRange,
                options: { description: 'paste-line-suffix', stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */ }
            }]);
        this._editor.focus();
        let editResult;
        let editRange;
        try {
            editResult = await this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor, token });
            editRange = model.getDecorationRange(editTrackingDecoration[0]);
        }
        catch (e) {
            return handleError(e, localize('applyError', "Error applying edit '{0}':\n{1}", edit.title, toErrorMessage(e)));
        }
        finally {
            model.deltaDecorations(editTrackingDecoration, []);
        }
        if (token.isCancellationRequested) {
            return;
        }
        if (canShowWidget && editResult.isApplied && edits.allEdits.length > 1) {
            this.show(editRange !== null && editRange !== void 0 ? editRange : primaryRange, edits, onDidSelectEdit);
        }
    }

}

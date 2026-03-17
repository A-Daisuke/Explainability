        const hideHover = (disposeWidget, disposePreparation) => {
            var _a;
            const hadHover = hoverWidget !== undefined;
            if (disposeWidget) {
                hoverWidget === null || hoverWidget === void 0 ? void 0 : hoverWidget.dispose();
                hoverWidget = undefined;
            }
            if (disposePreparation) {
                hoverPreparation === null || hoverPreparation === void 0 ? void 0 : hoverPreparation.dispose();
                hoverPreparation = undefined;
            }
            if (hadHover) {
                (_a = hoverDelegate.onDidHideHover) === null || _a === void 0 ? void 0 : _a.call(hoverDelegate);
                hoverWidget = undefined;
            }
        };

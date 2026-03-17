    function forEachReferencingModulesOfExportOfAffectedFile(state, affectedFile, fn) {
        if (!state.exportedModulesMap || !state.changedFilesSet.has(affectedFile.resolvedPath)) {
            return;
        }
        if (!isChangedSignagure(state, affectedFile.resolvedPath))
            return;
        if (state.compilerOptions.isolatedModules) {
            var seenFileNamesMap = ts.createMap();
            seenFileNamesMap.set(affectedFile.resolvedPath, true);
            var queue = ts.BuilderState.getReferencedByPaths(state, affectedFile.resolvedPath);
            while (queue.length > 0) {
                var currentPath = queue.pop();
                if (!seenFileNamesMap.has(currentPath)) {
                    seenFileNamesMap.set(currentPath, true);
                    var result = fn(state, currentPath);
                    if (result && isChangedSignagure(state, currentPath)) {
                        var currentSourceFile = ts.Debug.checkDefined(state.program).getSourceFileByPath(currentPath);
                        queue.push.apply(queue, ts.BuilderState.getReferencedByPaths(state, currentSourceFile.resolvedPath));
                    }
                }
            }
        }
        ts.Debug.assert(!!state.currentAffectedFilesExportedModulesMap);
        var seenFileAndExportsOfFile = ts.createMap();
        if (ts.forEachEntry(state.currentAffectedFilesExportedModulesMap, function (exportedModules, exportedFromPath) {
            return exportedModules &&
                exportedModules.has(affectedFile.resolvedPath) &&
                forEachFilesReferencingPath(state, exportedFromPath, seenFileAndExportsOfFile, fn);
        })) {
            return;
        }
        ts.forEachEntry(state.exportedModulesMap, function (exportedModules, exportedFromPath) {
            return !state.currentAffectedFilesExportedModulesMap.has(exportedFromPath) &&
                exportedModules.has(affectedFile.resolvedPath) &&
                forEachFilesReferencingPath(state, exportedFromPath, seenFileAndExportsOfFile, fn);
        });
    }

    function forEachReferencingModulesOfExportOfAffectedFile(state, affectedFile, fn) {
        // If there was change in signature (dts output) for the changed file,
        // then only we need to handle pending file emit
        if (!state.exportedModulesMap || !state.changedFilesSet.has(affectedFile.resolvedPath)) {
            return;
        }
        if (!isChangedSignagure(state, affectedFile.resolvedPath))
            return;
        // Since isolated modules dont change js files, files affected by change in signature is itself
        // But we need to cleanup semantic diagnostics and queue dts emit for affected files
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
        // Go through exported modules from cache first
        // If exported modules has path, all files referencing file exported from are affected
        if (ts.forEachEntry(state.currentAffectedFilesExportedModulesMap, function (exportedModules, exportedFromPath) {
            return exportedModules &&
                exportedModules.has(affectedFile.resolvedPath) &&
                forEachFilesReferencingPath(state, exportedFromPath, seenFileAndExportsOfFile, fn);
        })) {
            return;
        }
        // If exported from path is not from cache and exported modules has path, all files referencing file exported from are affected
        ts.forEachEntry(state.exportedModulesMap, function (exportedModules, exportedFromPath) {
            return !state.currentAffectedFilesExportedModulesMap.has(exportedFromPath) && // If we already iterated this through cache, ignore it
                exportedModules.has(affectedFile.resolvedPath) &&
                forEachFilesReferencingPath(state, exportedFromPath, seenFileAndExportsOfFile, fn);
        });
    }

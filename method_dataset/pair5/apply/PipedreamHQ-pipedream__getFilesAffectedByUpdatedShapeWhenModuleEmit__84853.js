        function getFilesAffectedByUpdatedShapeWhenModuleEmit(state, programOfThisState, sourceFileWithUpdatedShape, cacheToUpdateSignature, cancellationToken, computeHash, exportedModulesMapCache) {
            if (isFileAffectingGlobalScope(sourceFileWithUpdatedShape)) {
                return getAllFilesExcludingDefaultLibraryFile(state, programOfThisState, sourceFileWithUpdatedShape);
            }
            var compilerOptions = programOfThisState.getCompilerOptions();
            if (compilerOptions && (compilerOptions.isolatedModules || compilerOptions.out || compilerOptions.outFile)) {
                return [sourceFileWithUpdatedShape];
            }
            var seenFileNamesMap = ts.createMap();
            seenFileNamesMap.set(sourceFileWithUpdatedShape.resolvedPath, sourceFileWithUpdatedShape);
            var queue = getReferencedByPaths(state, sourceFileWithUpdatedShape.resolvedPath);
            while (queue.length > 0) {
                var currentPath = queue.pop();
                if (!seenFileNamesMap.has(currentPath)) {
                    var currentSourceFile = programOfThisState.getSourceFileByPath(currentPath);
                    seenFileNamesMap.set(currentPath, currentSourceFile);
                    if (currentSourceFile && updateShapeSignature(state, programOfThisState, currentSourceFile, cacheToUpdateSignature, cancellationToken, computeHash, exportedModulesMapCache)) {
                        queue.push.apply(queue, getReferencedByPaths(state, currentSourceFile.resolvedPath));
                    }
                }
            }
            return ts.arrayFrom(ts.mapDefinedIterator(seenFileNamesMap.values(), function (value) { return value; }));
        }

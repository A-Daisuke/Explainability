        function getFilesAffectedByUpdatedShapeWhenModuleEmit(state, programOfThisState, sourceFileWithUpdatedShape, cacheToUpdateSignature, cancellationToken, computeHash, exportedModulesMapCache) {
            if (isFileAffectingGlobalScope(sourceFileWithUpdatedShape)) {
                return getAllFilesExcludingDefaultLibraryFile(state, programOfThisState, sourceFileWithUpdatedShape);
            }
            var compilerOptions = programOfThisState.getCompilerOptions();
            if (compilerOptions && (compilerOptions.isolatedModules || compilerOptions.out || compilerOptions.outFile)) {
                return [sourceFileWithUpdatedShape];
            }
            // Now we need to if each file in the referencedBy list has a shape change as well.
            // Because if so, its own referencedBy files need to be saved as well to make the
            // emitting result consistent with files on disk.
            var seenFileNamesMap = ts.createMap();
            // Start with the paths this file was referenced by
            seenFileNamesMap.set(sourceFileWithUpdatedShape.resolvedPath, sourceFileWithUpdatedShape);
            var queue = getReferencedByPaths(state, sourceFileWithUpdatedShape.resolvedPath);
            while (queue.length > 0) {
                var currentPath = queue.pop();
                if (!seenFileNamesMap.has(currentPath)) {
                    var currentSourceFile = programOfThisState.getSourceFileByPath(currentPath);
                    seenFileNamesMap.set(currentPath, currentSourceFile);
                    if (currentSourceFile && updateShapeSignature(state, programOfThisState, currentSourceFile, cacheToUpdateSignature, cancellationToken, computeHash, exportedModulesMapCache)) { // TODO: GH#18217
                        queue.push.apply(// TODO: GH#18217
                        queue, getReferencedByPaths(state, currentSourceFile.resolvedPath));
                    }
                }
            }
            // Return array of values that needs emit
            // Return array of values that needs emit
            return ts.arrayFrom(ts.mapDefinedIterator(seenFileNamesMap.values(), function (value) { return value; }));
        }

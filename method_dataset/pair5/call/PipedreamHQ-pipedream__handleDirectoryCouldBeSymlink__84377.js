        function handleDirectoryCouldBeSymlink(directory) {
            if (!host.getResolvedProjectReferences())
                return;
            if (!originalRealpath || !ts.stringContains(directory, ts.nodeModulesPathPart))
                return;
            if (!symlinkedDirectories)
                symlinkedDirectories = ts.createMap();
            var directoryPath = ts.ensureTrailingDirectorySeparator(host.toPath(directory));
            if (symlinkedDirectories.has(directoryPath))
                return;
            var real = ts.normalizePath(originalRealpath.call(host.compilerHost, directory));
            var realPath;
            if (real === directory ||
                (realPath = ts.ensureTrailingDirectorySeparator(host.toPath(real))) === directoryPath) {
                symlinkedDirectories.set(directoryPath, false);
                return;
            }
            symlinkedDirectories.set(directoryPath, {
                real: ts.ensureTrailingDirectorySeparator(real),
                realPath: realPath
            });
        }

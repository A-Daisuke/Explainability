        function getAllModulePaths(importingFileName, importedFileName, host) {
            var cwd = host.getCurrentDirectory();
            var getCanonicalFileName = ts.hostGetCanonicalFileName(host);
            var allFileNames = ts.createMap();
            var importedFileFromNodeModules = false;
            forEachFileNameOfModule(importingFileName, importedFileName, host, true, function (path) {
                allFileNames.set(path, getCanonicalFileName(path));
                importedFileFromNodeModules = importedFileFromNodeModules || ts.pathContainsNodeModules(path);
            });
            var sortedPaths = [];
            var _loop_20 = function (directory) {
                var directoryStart = ts.ensureTrailingDirectorySeparator(directory);
                var pathsInDirectory;
                allFileNames.forEach(function (canonicalFileName, fileName) {
                    if (ts.startsWith(canonicalFileName, directoryStart)) {
                        if (!importedFileFromNodeModules || ts.pathContainsNodeModules(fileName)) {
                            (pathsInDirectory || (pathsInDirectory = [])).push(fileName);
                        }
                        allFileNames.delete(fileName);
                    }
                });
                if (pathsInDirectory) {
                    if (pathsInDirectory.length > 1) {
                        pathsInDirectory.sort(comparePathsByNumberOfDirectorySeparators);
                    }
                    sortedPaths.push.apply(sortedPaths, pathsInDirectory);
                }
                var newDirectory = ts.getDirectoryPath(directory);
                if (newDirectory === directory)
                    return out_directory_1 = directory, "break";
                directory = newDirectory;
                out_directory_1 = directory;
            };
            var out_directory_1;
            for (var directory = ts.getDirectoryPath(ts.toPath(importingFileName, cwd, getCanonicalFileName)); allFileNames.size !== 0;) {
                var state_8 = _loop_20(directory);
                directory = out_directory_1;
                if (state_8 === "break")
                    break;
            }
            if (allFileNames.size) {
                var remainingPaths = ts.arrayFrom(allFileNames.values());
                if (remainingPaths.length > 1)
                    remainingPaths.sort(comparePathsByNumberOfDirectorySeparators);
                sortedPaths.push.apply(sortedPaths, remainingPaths);
            }
            return sortedPaths;
        }

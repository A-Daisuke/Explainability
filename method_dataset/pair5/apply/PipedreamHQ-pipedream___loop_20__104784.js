            var _loop_20 = function (directory) {
                var directoryStart = ts.ensureTrailingDirectorySeparator(directory);
                var pathsInDirectory;
                allFileNames.forEach(function (canonicalFileName, fileName) {
                    if (ts.startsWith(canonicalFileName, directoryStart)) {
                        // If the importedFile is from node modules, use only paths in node_modules folder as option
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

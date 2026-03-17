function __method_wrapper__() {
            host.compilerHost.directoryExists = function (path) {
                if (originalDirectoryExists.call(host.compilerHost, path)) {
                    handleDirectoryCouldBeSymlink(path);
                    return true;
                }
                if (!host.getResolvedProjectReferences())
                    return false;
                if (!mapOfDeclarationDirectories) {
                    mapOfDeclarationDirectories = ts.createMap();
                    host.forEachResolvedProjectReference(function (ref) {
                        if (!ref)
                            return;
                        var out = ref.commandLine.options.outFile || ref.commandLine.options.out;
                        if (out) {
                            mapOfDeclarationDirectories.set(ts.getDirectoryPath(host.toPath(out)), true);
                        }
                        else {
                            // Set declaration's in different locations only, if they are next to source the directory present doesnt change
                            var declarationDir = ref.commandLine.options.declarationDir || ref.commandLine.options.outDir;
                            if (declarationDir) {
                                mapOfDeclarationDirectories.set(host.toPath(declarationDir), true);
                            }
                        }
                    });
                }
                return fileOrDirectoryExistsUsingSource(path, /*isFile*/ false);
            };

}

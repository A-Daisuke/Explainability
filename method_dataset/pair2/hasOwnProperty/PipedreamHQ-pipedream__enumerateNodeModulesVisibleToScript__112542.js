            function enumerateNodeModulesVisibleToScript(host, scriptPath) {
                if (!host.readFile || !host.fileExists)
                    return ts.emptyArray;
                var result = [];
                for (var _i = 0, _a = ts.findPackageJsons(scriptPath, host); _i < _a.length; _i++) {
                    var packageJson = _a[_i];
                    var contents = ts.readJson(packageJson, host); // Cast to assert that readFile is defined
                    // Provide completions for all non @types dependencies
                    for (var _b = 0, nodeModulesDependencyKeys_1 = nodeModulesDependencyKeys; _b < nodeModulesDependencyKeys_1.length; _b++) {
                        var key = nodeModulesDependencyKeys_1[_b];
                        var dependencies = contents[key];
                        if (!dependencies)
                            continue;
                        for (var dep in dependencies) {
                            if (dependencies.hasOwnProperty(dep) && !ts.startsWith(dep, "@types/")) {
                                result.push(dep);
                            }
                        }
                    }
                }
                return result;
            }

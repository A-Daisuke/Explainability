            var resolved = ts.forEach(paths[matchedPatternText], function (subst) {
                var path = matchedStar_1 ? subst.replace("*", matchedStar_1) : subst;
                var candidate = ts.normalizePath(ts.combinePaths(baseDirectory, path));
                if (state.traceEnabled) {
                    trace(state.host, ts.Diagnostics.Trying_substitution_0_candidate_module_location_Colon_1, subst, path);
                }
                var extension = ts.tryGetExtensionFromPath(candidate);
                if (extension !== undefined) {
                    var path_1 = tryFile(candidate, onlyRecordFailures, state);
                    if (path_1 !== undefined) {
                        return noPackageId({ path: path_1, ext: extension });
                    }
                }
                return loader(extensions, candidate, onlyRecordFailures || !ts.directoryProbablyExists(ts.getDirectoryPath(candidate), state.host), state);
            });

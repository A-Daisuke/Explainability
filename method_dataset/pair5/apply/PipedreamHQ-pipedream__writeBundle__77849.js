        function writeBundle(bundle, output, sourceMapGenerator) {
            var _a;
            isOwnFileEmit = false;
            var previousWriter = writer;
            setWriter(output, sourceMapGenerator);
            emitShebangIfNeeded(bundle);
            emitPrologueDirectivesIfNeeded(bundle);
            emitHelpers(bundle);
            emitSyntheticTripleSlashReferencesIfNeeded(bundle);
            for (var _b = 0, _c = bundle.prepends; _b < _c.length; _b++) {
                var prepend = _c[_b];
                writeLine();
                var pos = writer.getTextPos();
                var savedSections = bundleFileInfo && bundleFileInfo.sections;
                if (savedSections)
                    bundleFileInfo.sections = [];
                print(4, prepend, undefined);
                if (bundleFileInfo) {
                    var newSections = bundleFileInfo.sections;
                    bundleFileInfo.sections = savedSections;
                    if (prepend.oldFileOfCurrentEmit)
                        (_a = bundleFileInfo.sections).push.apply(_a, newSections);
                    else {
                        newSections.forEach(function (section) { return ts.Debug.assert(ts.isBundleFileTextLike(section)); });
                        bundleFileInfo.sections.push({
                            pos: pos,
                            end: writer.getTextPos(),
                            kind: "prepend",
                            data: relativeToBuildInfo(prepend.fileName),
                            texts: newSections
                        });
                    }
                }
            }
            sourceFileTextPos = getTextPosWithWriteLine();
            for (var _d = 0, _e = bundle.sourceFiles; _d < _e.length; _d++) {
                var sourceFile = _e[_d];
                print(0, sourceFile, sourceFile);
            }
            if (bundleFileInfo && bundle.sourceFiles.length) {
                var end = writer.getTextPos();
                if (recordBundleFileTextLikeSection(end)) {
                    var prologues = getPrologueDirectivesFromBundledSourceFiles(bundle);
                    if (prologues) {
                        if (!bundleFileInfo.sources)
                            bundleFileInfo.sources = {};
                        bundleFileInfo.sources.prologues = prologues;
                    }
                    var helpers = getHelpersFromBundledSourceFiles(bundle);
                    if (helpers) {
                        if (!bundleFileInfo.sources)
                            bundleFileInfo.sources = {};
                        bundleFileInfo.sources.helpers = helpers;
                    }
                }
            }
            reset();
            writer = previousWriter;
        }

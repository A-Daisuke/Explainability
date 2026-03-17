        function createFileDiagnosticAtReference(refPathToReportErrorOn, message) {
            var _a, _b;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var refFile = ts.Debug.checkDefined(getSourceFileByPath(refPathToReportErrorOn.file));
            var kind = refPathToReportErrorOn.kind, index = refPathToReportErrorOn.index;
            var pos, end;
            switch (kind) {
                case ts.RefFileKind.Import:
                    pos = ts.skipTrivia(refFile.text, refFile.imports[index].pos);
                    end = refFile.imports[index].end;
                    break;
                case ts.RefFileKind.ReferenceFile:
                    (_a = refFile.referencedFiles[index], pos = _a.pos, end = _a.end);
                    break;
                case ts.RefFileKind.TypeReferenceDirective:
                    (_b = refFile.typeReferenceDirectives[index], pos = _b.pos, end = _b.end);
                    break;
                default:
                    return ts.Debug.assertNever(kind);
            }
            return ts.createFileDiagnostic.apply(void 0, __spreadArrays([refFile, pos, end - pos, message], args));
        }

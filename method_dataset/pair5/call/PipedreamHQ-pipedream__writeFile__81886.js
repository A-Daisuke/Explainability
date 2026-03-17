function __method_wrapper__() {
            host.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                var key = toPath(fileName);
                fileExistsCache.delete(key);
                var value = readFileCache.get(key);
                if (value !== undefined && value !== data) {
                    readFileCache.delete(key);
                    sourceFileCache.delete(key);
                }
                else if (getSourceFileWithCache) {
                    var sourceFile = sourceFileCache.get(key);
                    if (sourceFile && sourceFile.text !== data) {
                        sourceFileCache.delete(key);
                    }
                }
                originalWriteFile.call(host, fileName, data, writeByteOrderMark, onError, sourceFiles);
            };

}

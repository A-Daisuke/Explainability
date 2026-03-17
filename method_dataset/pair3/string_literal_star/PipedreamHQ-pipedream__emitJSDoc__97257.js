        function emitJSDoc(node) {
            write("/**");
            if (node.comment) {
                var lines = node.comment.split(/\r\n?|\n/g);
                for (var _a = 0, lines_2 = lines; _a < lines_2.length; _a++) {
                    var line = lines_2[_a];
                    writeLine();
                    writeSpace();
                    writePunctuation("*");
                    writeSpace();
                    write(line);
                }
            }
            if (node.tags) {
                if (node.tags.length === 1 && node.tags[0].kind === 320 /* JSDocTypeTag */ && !node.comment) {
                    writeSpace();
                    emit(node.tags[0]);
                }
                else {
                    emitList(node, node.tags, 33 /* JSDocComment */);
                }
            }
            writeSpace();
            write("*/");
        }

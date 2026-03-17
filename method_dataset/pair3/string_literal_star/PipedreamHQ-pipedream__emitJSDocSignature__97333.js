        function emitJSDocSignature(sig) {
            if (sig.typeParameters) {
                emitList(sig, ts.createNodeArray(sig.typeParameters), 33 /* JSDocComment */);
            }
            if (sig.parameters) {
                emitList(sig, ts.createNodeArray(sig.parameters), 33 /* JSDocComment */);
            }
            if (sig.type) {
                writeLine();
                writeSpace();
                writePunctuation("*");
                writeSpace();
                emit(sig.type);
            }
        }

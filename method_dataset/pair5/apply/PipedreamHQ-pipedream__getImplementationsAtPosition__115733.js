        function getImplementationsAtPosition(program, cancellationToken, sourceFiles, sourceFile, position) {
            var node = ts.getTouchingPropertyName(sourceFile, position);
            var referenceEntries;
            var entries = getImplementationReferenceEntries(program, cancellationToken, sourceFiles, node, position);
            if (node.parent.kind === 194 /* PropertyAccessExpression */
                || node.parent.kind === 191 /* BindingElement */
                || node.parent.kind === 195 /* ElementAccessExpression */
                || node.kind === 102 /* SuperKeyword */) {
                referenceEntries = entries && __spreadArrays(entries);
            }
            else {
                var queue = entries && __spreadArrays(entries);
                var seenNodes = ts.createMap();
                while (queue && queue.length) {
                    var entry = queue.shift();
                    if (!ts.addToSeen(seenNodes, ts.getNodeId(entry.node))) {
                        continue;
                    }
                    referenceEntries = ts.append(referenceEntries, entry);
                    var entries_1 = getImplementationReferenceEntries(program, cancellationToken, sourceFiles, entry.node, entry.node.pos);
                    if (entries_1) {
                        queue.push.apply(queue, entries_1);
                    }
                }
            }
            var checker = program.getTypeChecker();
            return ts.map(referenceEntries, function (entry) { return toImplementationLocation(entry, checker); });
        }

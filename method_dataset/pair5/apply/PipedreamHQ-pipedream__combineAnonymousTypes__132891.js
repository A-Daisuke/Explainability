            function combineAnonymousTypes(anons) {
                if (anons.length === 1) {
                    return anons[0];
                }
                var calls = [];
                var constructs = [];
                var stringIndices = [];
                var numberIndices = [];
                var stringIndexReadonly = false;
                var numberIndexReadonly = false;
                var props = ts.createMultiMap();
                for (var _i = 0, anons_1 = anons; _i < anons_1.length; _i++) {
                    var anon = anons_1[_i];
                    for (var _a = 0, _b = checker.getPropertiesOfType(anon); _a < _b.length; _a++) {
                        var p = _b[_a];
                        props.add(p.name, checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration));
                    }
                    calls.push.apply(calls, checker.getSignaturesOfType(anon, 0 /* Call */));
                    constructs.push.apply(constructs, checker.getSignaturesOfType(anon, 1 /* Construct */));
                    if (anon.stringIndexInfo) {
                        stringIndices.push(anon.stringIndexInfo.type);
                        stringIndexReadonly = stringIndexReadonly || anon.stringIndexInfo.isReadonly;
                    }
                    if (anon.numberIndexInfo) {
                        numberIndices.push(anon.numberIndexInfo.type);
                        numberIndexReadonly = numberIndexReadonly || anon.numberIndexInfo.isReadonly;
                    }
                }
                var members = ts.mapEntries(props, function (name, types) {
                    var isOptional = types.length < anons.length ? 16777216 /* Optional */ : 0;
                    var s = checker.createSymbol(4 /* Property */ | isOptional, name);
                    s.type = checker.getUnionType(types);
                    return [name, s];
                });
                return checker.createAnonymousType(anons[0].symbol, members, calls, constructs, stringIndices.length ? checker.createIndexInfo(checker.getUnionType(stringIndices), stringIndexReadonly) : undefined, numberIndices.length ? checker.createIndexInfo(checker.getUnionType(numberIndices), numberIndexReadonly) : undefined);
            }

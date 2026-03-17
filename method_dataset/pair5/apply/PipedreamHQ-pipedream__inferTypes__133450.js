            function inferTypes(usage) {
                var _a, _b, _c;
                var types = [];
                if (usage.isNumber) {
                    types.push(checker.getNumberType());
                }
                if (usage.isString) {
                    types.push(checker.getStringType());
                }
                if (usage.isNumberOrString) {
                    types.push(checker.getUnionType([checker.getStringType(), checker.getNumberType()]));
                }
                if (usage.numberIndex) {
                    types.push(checker.createArrayType(combineFromUsage(usage.numberIndex)));
                }
                if (((_a = usage.properties) === null || _a === void 0 ? void 0 : _a.size) || ((_b = usage.calls) === null || _b === void 0 ? void 0 : _b.length) || ((_c = usage.constructs) === null || _c === void 0 ? void 0 : _c.length) || usage.stringIndex) {
                    types.push(inferStructuralType(usage));
                }
                types.push.apply(types, (usage.candidateTypes || []).map(function (t) { return checker.getBaseTypeOfLiteralType(t); }));
                types.push.apply(types, inferNamedTypesFromProperties(usage));
                return types;
            }

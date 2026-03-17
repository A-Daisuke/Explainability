        function scanHexDigits(minCount, scanAsManyAsPossible, canHaveSeparators) {
            var valueChars = [];
            var allowSeparator = false;
            var isPreviousTokenSeparator = false;
            while (valueChars.length < minCount || scanAsManyAsPossible) {
                var ch = text.charCodeAt(pos);
                if (canHaveSeparators && ch === 95) {
                    tokenFlags |= 512;
                    if (allowSeparator) {
                        allowSeparator = false;
                        isPreviousTokenSeparator = true;
                    }
                    else if (isPreviousTokenSeparator) {
                        error(ts.Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1);
                    }
                    else {
                        error(ts.Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1);
                    }
                    pos++;
                    continue;
                }
                allowSeparator = canHaveSeparators;
                if (ch >= 65 && ch <= 70) {
                    ch += 97 - 65;
                }
                else if (!((ch >= 48 && ch <= 57) ||
                    (ch >= 97 && ch <= 102))) {
                    break;
                }
                valueChars.push(ch);
                pos++;
                isPreviousTokenSeparator = false;
            }
            if (valueChars.length < minCount) {
                valueChars = [];
            }
            if (text.charCodeAt(pos - 1) === 95) {
                error(ts.Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1);
            }
            return String.fromCharCode.apply(String, valueChars);
        }

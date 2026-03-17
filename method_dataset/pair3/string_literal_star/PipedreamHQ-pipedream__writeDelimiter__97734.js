        function writeDelimiter(format) {
            switch (format & 60 /* DelimitersMask */) {
                case 0 /* None */:
                    break;
                case 16 /* CommaDelimited */:
                    writePunctuation(",");
                    break;
                case 4 /* BarDelimited */:
                    writeSpace();
                    writePunctuation("|");
                    break;
                case 32 /* AsteriskDelimited */:
                    writeSpace();
                    writePunctuation("*");
                    writeSpace();
                    break;
                case 8 /* AmpersandDelimited */:
                    writeSpace();
                    writePunctuation("&");
                    break;
            }
        }
